const { Router } = require("express");
const { BuildController } = require("../../controllers");
const { authenticate, authenticateUser } = require("../../middlewares");
const router = Router();

// Auth routes
router.post("/create", authenticate, BuildController.CreateProject);
router.post("/deploy", authenticate, BuildController.DeployProject);
router.post(
    "/logs",
    authenticate,

    BuildController.ProjectLogs
);

module.exports = router;
