const express = require("express");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const { generateSlug } = require("random-word-slugs");
const { CLUSTER, TASK, SUBNETS, SECURITY_GROUP } = require("./config");
const Redis = require("ioredis");
const { Server } = require("socket.io");

const REDIS_KEY = process.env.REDIS_KEY;
const subscriber = new Redis(REDIS_KEY);

const io = new Server({ cors: "*" });

io.on("connection", (socket) => {
    socket.on("subscribe", (channel) => {
        socket.join(channel);
        socket.emit("message", `Joined ${channel}`);
    });
});

io.listen(9001, () => console.log("Socket sercer 9001.."));

const app = express();
const PORT = 9000;

app.use(express.json());

const ecsClient = new ECSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

app.post("/project", async (req, res) => {
    const { gitURL, slug } = req.body;
    const projectSlug = slug ? slug : generateSlug();

    // Spin the container
    const command = new RunTaskCommand({
        cluster: CLUSTER,
        taskDefinition: TASK,
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: SUBNETS,
                securityGroups: SECURITY_GROUP,
            },
        },
        overrides: {
            containerOverrides: [
                {
                    name: process.env.CONTAINER_NAME,
                    environment: [
                        { name: "GIT_REPOSITORY__URL", value: gitURL },
                        { name: "PROJECT_ID", value: projectSlug },
                    ],
                },
            ],
        },
    });

    await ecsClient.send(command);

    return res.json({
        status: "queued",
        data: { projectSlug, url: `http://${projectSlug}.localhost:8000` },
    });
});

async function initRedisSubscribe() {
    console.log("Subscribed to logs....");
    subscriber.psubscribe("logs:*");
    subscriber.on("pmessage", (pattern, channel, message) => {
        io.to(channel).emit("message", message);
    });
}

initRedisSubscribe();

app.listen(PORT, () => console.log(`API server Running..${PORT}`));
