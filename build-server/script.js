const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const mime = require("mime-types");

dotenv.config();

const PROJECT_ID = process.env.PROJECT_ID;

const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
});

async function init() {
    console.log("Executing script.js");
    const build_outputs_path = path.join(__dirname, "build_outputs");

    // to install packages and build project
    const build_process = exec(
        `cd ${build_outputs_path} && npm install && npm run build`
    );

    // for ongoing process output
    build_process.stdout.on("data", function (data) {
        console.log(data.toString());
    });

    // for error process output
    build_process.stdout.on("error", function (data) {
        console.log("Error", data.toString());
    });

    // for completed process
    build_process.stdout.on("close", async function (data) {
        console.log("Build complete");

        // getting Dist forlder path
        const distFolderPath = path.join(__dirname, "build_outputs", "dist");
        const distFolderContents = fs.readdirSync(distFolderPath, {
            // to get all files in nested folders
            recursive: true,
        });

        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);

            // if filePath is folder then skip it
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log("uploading", filePath);

            // else upload it on s3
            const command = new PutObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                // Use mime-type to get file extenstion
                ContentType: mime.lookup(filePath),
            });

            await s3Client.send(command);
            console.log("uploaded", filePath);
        }
        console.log("Done...");
    });
}

init();
