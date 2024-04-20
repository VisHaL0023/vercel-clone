const { Router } = require("express");

const router = Router();

// Auth routes
router.post("/project");
router.post("/deploy");

module.exports = router;
