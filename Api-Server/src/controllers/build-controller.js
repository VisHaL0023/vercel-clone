const { ServerConfig } = require("./../config");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const { generateSlug } = require("random-word-slugs");

const ecsClient = new ECSClient({
    region: ServerConfig.S3_REGION,
    credentials: {
        accessKeyId: ServerConfig.S3_ACCESS_KEY_ID,
        secretAccessKey: ServerConfig.S3_SECRET_ACCESS_KEY,
    },
});

async function CreateProject(req, res) {
    const { gitURL, slug } = req.body;
    console.log("gitURL", gitURL);
    const projectSlug = slug ? slug : generateSlug(2);

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
                    name: "builder-image",
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
            url: `http://${projectSlug}.localhost:8000`,
        },
    });
}

module.exports = { CreateProject };
