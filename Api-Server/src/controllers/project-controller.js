const { errorObj, successObj } = require("../utils/index.js");
const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getProject(req, res) {
    try {
        const id = req.body.id;
        if (!id) {
            errorObj.message = "ID required";
            errorObj.success = false;
            return res.status(StatusCodes.BAD_REQUEST).json(errorObj);
        }

        const project = await prisma.project.findUnique({
            where: {
                id: id,
            },
        });
        successObj.success = true;
        successObj.data = project;
        return res.status(StatusCodes.OK).json(successObj);
    } catch (error) {
        //Handling error
        errorObj.message = error.message;
        errorObj.err = error;

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorObj);
    }
}

async function getAllProject(req, res) {
    try {
        const userId = req.user.id;

        const projects = await prisma.project.findMany({
            where: {
                userId: userId,
            },
        });
        successObj.success = true;
        successObj.data = projects;
        return res.status(StatusCodes.OK).json(successObj);
    } catch (error) {
        //Handling error
        errorObj.message = error.message;
        errorObj.err = error;

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorObj);
    }
}

async function changeStatus(req, res) {
    try {
        const deployementId = req.body.id;
        if (!deployementId) {
            errorObj.message = "Deployment ID required";
            errorObj.success = false;
            return res.status(StatusCodes.BAD_REQUEST).json(errorObj);
        }

        console.log(deployementId);
        const project = await prisma.deployement.findFirst({
            where: {
                id: deployementId,
            },
        });

        if (!project) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Project not found",
            });
        }

        // Update the status of the found project
        const updatedProject = await prisma.deployement.update({
            where: {
                id: deployementId,
            },
            data: {
                status: "READY",
            },
        });
        successObj.success = true;
        successObj.data = updatedProject;
        return res.status(StatusCodes.OK).json(successObj);
    } catch (error) {
        //Handling error
        errorObj.message = error.message;
        errorObj.err = error;

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorObj);
    }
}

module.exports = { getProject, getAllProject, changeStatus };
