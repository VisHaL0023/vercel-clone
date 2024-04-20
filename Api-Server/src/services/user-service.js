const { ServerConfig } = require("../config/index");
const { PrismaClient, Prisma } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

const prisma = new PrismaClient();

async function GenerateJWT(reqbody) {
    try {
        // checking if user is present
        const user = await prisma.user.findUnique({
            where: {
                email: reqbody.email,
            },
        });

        // returning token
        return jsonwebtoken.sign(
            { id: user.id, email: user.email },
            ServerConfig.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );
    } catch (error) {
        console.log(error);
    }
}

async function SignUp(reqbody) {
    try {
        // checking if user is present
        let user = await prisma.user.findUnique({
            where: {
                email: reqbody.email,
            },
        });

        // if user not present already then we can create user
        if (!user) {
            // Check OTP for the user in OTP model
            const response = await prisma.oTP.findUnique({
                where: {
                    email: reqbody.email,
                },
            });

            // OTP not found for the email or not equal to otp
            if (response.length === 0 || reqbody.otp !== response[0].otp) {
                throw {
                    success: false,
                    message: "The OTP is not valid",
                };
            }

            const salt = bcrypt.genSaltSync(9);
            const encryptedPassword = bcrypt.hashSync(reqbody.password, salt);

            // Creating user
            const user = await prisma.user.create({
                firstName: reqbody.firstName,
                lastName: reqbody.lastName,
                email: reqbody.email,
                password: encryptedPassword,
                image: reqbody.img || "sample", // TODO: needs to add real image
            });
            return user;
        }
        // Throw error if email already exists
        throw {
            message: "User already exists for given email",
        };
    } catch (error) {
        // Handle error
        console.log("Something went wrong in user service");
        console.log(error);
        throw error;
    }
}

async function SignIn(reqbody) {
    try {
        // checking if user is present
        const user = await this.userRepository.findOne({
            email: reqbody.email,
        });

        if (!user) {
            throw {
                message: "No user found",
            };
        }

        // Check password with current user
        const isPasswordMatch = await bcrypt.compareSync(
            reqbody.password,
            user.password
        );
        if (!isPasswordMatch) {
            throw {
                message: "Incorrect password",
            };
        }
        // Generate JWT token for user
        const token = await GenerateJWT(reqbody);

        // Settign password undefined because we need to send user obj to frontend
        user.password = undefined;

        // Set cookie for token and return success response
        return { user, token };
    } catch (error) {
        // Handle error
        console.log(error);
        throw error;
    }
}

async function SendOtp(email) {
    try {
        // checking if user is present
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        console.log("user", user);

        if (user) {
            throw {
                message: "User already exists for given email",
            };
        }

        // Generating OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: true,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        const data = {
            email: email,
            otp: otp,
        };

        // Save OTP to database for 5 mints
        const response = await prisma.oTP.create({ data: data });
        return response;
    } catch (error) {
        // Handle errors
        console.log(error);
        return error;
    }
}

module.exports = { SignIn, SendOtp, SignUp };
