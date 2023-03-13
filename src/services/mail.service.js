import { FRONTEND_URL, MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USERNAME } from "../config";
import nodemailer from "nodemailer";

export default class MailService {

    constructor() {
        this.supportEmail = "support@ikecruz.dev";
        this.transport = null;
        this.init();
    }

    init() {
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

    async sendVerificationMail(email, token, newUser = false) {

        const newUserHtml = `
            <b>Welcome to Vetly ${email}</b> <br />
            Click link below to verify your account <br />
            <a href=${FRONTEND_URL}?token=${token}>Verify</a>
        `;

        const oldUserHtml = `
            <b>Dear ${email}</b> <br />
            Click link below to verify your account <br />
            <a href=${FRONTEND_URL}?token=${token}>Verify</a>
        `;

        const mailOption = {
            from: `"Vetly" ${this.supportEmail}`,
            to: email,
            subject: newUser ? "Welcome to Vetly" : "Email verification token",
            html: newUser ? newUserHtml : oldUserHtml
        };

        const result = await this.transport.sendMail(mailOption);

        return result;

    }

    async sendPasswordResetMail(email, token) {

        const mailOption = {
            from: `"Vetly" ${this.supportEmail}`,
            to: email,
            subject: "Reset Password",
            html: `
                <b>Click link below to reset your password </b> <br /> 
                <a href=${FRONTEND_URL}?token=${token}>Verify</a>
            `
        };

        return await this.transport.sendMail(mailOption);

    }

}