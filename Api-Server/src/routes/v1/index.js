const { Router } = require("express");
const authRoutes = require("./auth-routes.js");
const buildRoutes = require("./build-routes.js");
const { InfoController } = require("../../controllers/index.js");

const router = Router();

router.use("/auth", authRoutes);
router.use("/project", buildRoutes);

// Checking api is live
router.get("/info", InfoController.info);

module.exports = router;
