const express = require("express");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const { generateSlug } = require("random-word-slugs");
const { CLUSTER, TASK, SUBNETS, SECURITY_GROUP } = require("./config");
const Redis = require("ioredis");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

app.use(cors());
const PORT = process.env.PORT;

const REDIS_KEY = process.env.REDIS_KEY;
const subscriber = new Redis(REDIS_KEY);

const io = new Server({ cors: "*" });

io.on("connection", (socket) => {
    socket.on("subscribe", (channel) => {
        socket.join(channel);
        socket.emit("message", `Joined ${channel}`);
    });
});

io.listen(process.env.SCOKET_PORT, () =>
    console.log(`Socket sercer ${process.env.SOCKET_PORT}..`)
);

app.use(express.json());

const ecsClient = new ECSClient({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
});

app.post("/project", async (req, res) => {
    const { gitURL, slug } = req.body;
    if (!gitURL) return res.status(403, "URL is required");
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
                    name: process.env.CONTAINER_IMAGE,
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
        data: {
            projectSlug,
            url: `https://vercel-clone-nae3.onrender.com/#${projectSlug}`,
        },
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
