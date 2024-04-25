const mailSender = require("./email-trasport");
const emailTemplate = require("../mails/emailVerificationTemplate");

async function sendVerificationEmail(email, otp) {
    // Create a transporter to send emails

    // Define the email options

    // Send the email
    try {
        console.log("trying sending mail");
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            emailTemplate(otp)
        );
        console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}

module.exports = { sendVerificationEmail };
