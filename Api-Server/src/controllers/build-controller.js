const { ServerConfig, clickHouseClient } = require("./../config");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const { generateSlug } = require("random-word-slugs");
const { z } = require("zod");
const { errorObj, successObj } = require("../utils/index.js");
const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ecsClient = new ECSClient({
    region: ServerConfig.S3_REGION,
    credentials: {
        accessKeyId: ServerConfig.S3_ACCESS_KEY_ID,
        secretAccessKey: ServerConfig.S3_SECRET_ACCESS_KEY,
    },
});

async function DeployProject(req, res) {
    try {
        const schema = z.object({
            projectId: z.string(),
        });
        const safeParseResult = schema.safeParse(req.body);

        if (safeParseResult.error) {
            errorObj.message = safeParseResult.error;
            errorObj.success = false;
            return res.status(StatusCodes.FORBIDDEN).json(errorObj);
        }

        const { projectId } = safeParseResult.data;

        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
            },
        });

        if (!project) {
            errorObj.message = "Project not found";
            errorObj.success = false;
            return res.status(StatusCodes.NOT_FOUND).json(errorObj);
        }

        const deployement = await prisma.deployement.create({
            data: {
                project: { connect: { id: projectId } },
                status: "QUEUED",
            },
        });

        // Spin the container
        const command = new RunTaskCommand({
            cluster: ServerConfig.CLUSTER,
            taskDefinition: ServerConfig.TASK,
            launchType: "FARGATE",
            count: 1,
            networkConfiguration: {
                awsvpcConfiguration: {
                    assignPublicIp: "ENABLED",
                    subnets: ServerConfig.SUBNETS,
                    securityGroups: ServerConfig.SECURITY_GROUP,
                },
            },
            overrides: {
                containerOverrides: [
                    {
                        name: "builder-image",
                        environment: [
                            {
                                name: "GIT_REPOSITORY__URL",
                                value: project.gitURL,
                            },
                            { name: "PROJECT_ID", value: projectId },
                            { name: "DEPLOYEMENT_ID", value: deployement.id },
                        ],
                    },
                ],
            },
        });
        await ecsClient.send(command);

        return res.json({
            status: "queued",
            data: {
                deployementId: deployement.id,
                url: `http://${project.subDomain}.localhost:8000`,
            },
        });
    } catch (error) {
        //Handling error
        errorObj.message = error.message;
        errorObj.err = error;

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorObj);
    }
}

async function CreateProject(req, res) {
    try {
        const schema = z.object({
            name: z.string(),
            gitURL: z.string(),
        });
        const safeParseResult = schema.safeParse(req.body);

        if (safeParseResult.error) {
            errorObj.message = safeParseResult.error;
            errorObj.success = false;
            return res.status(StatusCodes.FORBIDDEN).json(errorObj);
        }
        const { name, gitURL } = safeParseResult.data;

        const project = await prisma.project.create({
            data: {
                name,
                gitURL,
                subDomain: generateSlug(2),
                user: { connect: { id: req.user.id } },
            },
        });

        successObj.success = true;
        successObj.data = project;
        return res.status(StatusCodes.CREATED).json(successObj);
    } catch (error) {
        //Handling error
        errorObj.message = error.message;
        errorObj.err = error;

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorObj);
    }
}

async function ProjectLogs(req, res) {
    try {
        const id = req.params.id;
        const logs = await clickHouseClient.query({
            query: `SELECT event_id, deployment_id, log, timestamp from log_events where deployment_id = {deployment_id:String}`,
            query_params: {
                deployment_id: id,
            },
            format: "JSONEachRow",
        });

        const rawLogs = await logs.json();

        return res.status(StatusCodes.OK).json({ logs: rawLogs });
    } catch (error) {
        errorObj.message = error.message;
        errorObj.err = error;

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorObj);
    }
}

module.exports = { DeployProject, CreateProject, ProjectLogs };
