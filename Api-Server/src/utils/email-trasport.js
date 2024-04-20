const { createTransport } = require("nodemailer");
const { ServerConfig } = require("../config/index");

const mailSender = async (email, title, body) => {
    try {
        let transporter = createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: ServerConfig.NODE_MAILER_EMAIL,
                pass: ServerConfig.NODE_MAILER_PASSWORD,
            },
        });

        let info = await transporter.sendMail({
            from: `"Study Notion" <${ServerConfig.NODE_MAILER_EMAIL}>`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        console.log(info);
        return info;
    } catch (error) {
        console.log(error.message);
        return error;
    }
};

module.exports = mailSender;
