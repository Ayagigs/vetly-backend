import { FRONTEND_URL, MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USERNAME } from "../config";
import nodemailer from "nodemailer";

export default class MailService {

    constructor() {
        this.transport = null;
        this.init();
    }

    init() {
        this.transport = nodemailer.createTransport({
            host: MAIL_HOST,
            port: MAIL_PORT,
            auth: {
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD
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
            // eslint-disable-next-line quotes
            from: '"Vetly" support@ikecruz.dev',
            to: email,
            subject: newUser ? "Welcome to Vetly" : "Email verification token",
            html: newUser ? newUserHtml : oldUserHtml
        };

        const result = await this.transport.sendMail(mailOption);

        return result;

    }

    async sendPasswordResetMail(email, token) {

        const mailOption = {
            // eslint-disable-next-line quotes
            from: '"Vetly" support@ikecruz.dev',
            to: email,
            subject: "Reset Password",
            html: `
                <b>Click link below to reset your password </b> <br /> 
                <a href=${FRONTEND_URL}?token=${token}>Verify</a>
            `
        };

        return await this.transport.sendMail(mailOption);

    }

    async sendVettingEmail(email) {

        const mailOption = {
            // eslint-disable-next-line quotes
            from: '"Vetly" support@ikecruz.dev',
            to: email,
            subject: "Vet Employee",
            html: `
                <b>Click link below to vet employee </b> <br />
                <a href=${FRONTEND_URL}>Vet</a>
            `
        };

        return await this.transport.sendMail(mailOption);
    }

}