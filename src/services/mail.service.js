import { FRONTEND_URL, MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USERNAME } from "../config";
import nodemailer from "nodemailer";

export default class MailService {

    constructor () {
        this.transport = null;
        this.init();
    }

    init () {
        this.transport = nodemailer.createTransport({
            host: MAIL_HOST,
            port: MAIL_PORT,
            secure: false,
            auth: {
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }

    async sendVerificationMail (email, token) {

        const mailOption = {
            from: "support@vetly.com",
            to: email,
            subject: "Welcome to Vetly",
            html: `<b>Welcome ${email}</b> Click link below to verify your account <a href=${FRONTEND_URL}?token=${token}>Verify</a>`
        };

        const result = await this.transport.sendMail(mailOption);

        return result;

    }

    async sendPasswordResetMail (email, token) {

        const mailOption = {
            from: "support@vetly.com",
            to: email,
            subject: "Reset Password",
            html: `<b>Click link below to reset your password <a href=${FRONTEND_URL}?token=${token}>Verify</a>`
        }; 

        return await this.transport.sendMail(mailOption);

    }

}