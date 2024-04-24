const { Router } = require("express");
const { authenticate, authenticateUser } = require("../../middlewares");
const { ProjectController } = require("../../controllers");
const router = Router();

// Auth routes
router.post("/", authenticate, ProjectController.getProject);
router.get("/", authenticate, ProjectController.getAllProject);

module.exports = router;
