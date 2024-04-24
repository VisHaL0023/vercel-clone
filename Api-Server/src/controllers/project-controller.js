const { errorObj, successObj } = require("../utils/index.js");
const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getProject(req, res) {
    try {
        const id = req.body.id;
        console.log("id", id);

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

module.exports = { getProject, getAllProject };
