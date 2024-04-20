const { Router } = require("express");
const { AuthController } = require("../../controllers/index");

const router = Router();

// Auth routes
router.post("/signup", AuthController.CreateUser);
router.post("/login", AuthController.LogIn);
router.post("/sendotp", AuthController.SendOtp);

module.exports = router;
