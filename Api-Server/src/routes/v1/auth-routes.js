const { Router } = require("express");
const { AuthController } = require("../../controllers/index");
const { authenticate } = require("../../middlewares");

const router = Router();

// Auth routes
router.post("/signup", AuthController.CreateUser);
router.post("/login", AuthController.LogIn);
router.post("/sendotp", AuthController.SendOtp);

router.get("/getUserByToken", authenticate, AuthController.getUserDetails);

module.exports = router;
