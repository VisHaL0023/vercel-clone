const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
const { Kafka } = require("kafkajs");

const PROJECT_ID = process.env.PROJECT_ID;
const DEPLOYEMENT_ID = process.env.DEPLOYEMENT_ID;
const KAFKA_BROKERS = process.env.KAFKA_BROKERS;
const KAFKA_TOPICS = process.env.KAFKA_TOPICS;
const S3_REGION = process.env.S3_REGION;
const BUCKET_NAME = process.env.BUCKET_NAME;
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
    region: S3_REGION,
    credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
});

const kafka = new Kafka({
    clientId: `docker-build-server-${DEPLOYEMENT_ID}`,
    brokers: [KAFKA_BROKERS],
    ssl: {
        ca: [fs.readFileSync(path.join(__dirname, "kafka.pem"), "utf-8")],
    },
    sasl: {
        username: "avnadmin",
        password: KAFKA_PASSWORD,
        mechanism: "plain",
    },
    connectionTimeout: 100000,
    requestTimeout: 25000,
    retry: {
        initialRetryTime: 100,
        retries: 10,
    },
});

const producer = kafka.producer();

async function publishlog(log) {
    await producer.send({
        topic: KAFKA_TOPICS,
        messages: [
            {
                key: "log",
                value: JSON.stringify({ PROJECT_ID, DEPLOYEMENT_ID, log }),
            },
        ],
    });
}

async function init() {
    await producer.connect();

    console.log("Executing script.js");
    await publishlog("Building...");
    const build_outputs_path = path.join(__dirname, "build_outputs");

    // to install packages and build project
    const build_process = exec(
        `cd ${build_outputs_path} && npm install && npm run build`
    );

    // for ongoing process output
    build_process.stdout.on("data", async function (data) {
        console.log(data.toString());
        await publishlog(data.toString());
    });

    // for error process output
    build_process.stdout.on("error", async function (data) {
        console.log("Error", data.toString());
        await publishlog(`error:${data.toString()}`);
    });

    // for completed process
    build_process.stdout.on("close", async function () {
        console.log("Build complete");
        await publishlog("Build completed");

        // getting Dist forlder path
        const distFolderPath = path.join(__dirname, "build_outputs", "dist");
        const distFolderContents = fs.readdirSync(distFolderPath, {
            // to get all files in nested folders
            recursive: true,
        });

        await publishlog("Starting upload");
        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);

            // if filePath is folder then skip it
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log("uploading", filePath);
            await publishlog(`uploading ${file}`);

            // else upload it on s3
            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                // Use mime-type to get file extenstion
                ContentType: mime.lookup(filePath),
            });

            await s3Client.send(command);
            console.log("uploaded", filePath);
            await publishlog(`uploaded ${filePath}`);
        }
        await publishlog("Done");
        console.log("Done...");
        process.exit(0);
    });
}

init();
