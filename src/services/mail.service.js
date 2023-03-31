import { FRONTEND_URL, MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USERNAME } from "../config";
import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { join } from "path";
import { __dirname } from "../utils/logger";
import handlebars from "handlebars";

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

    compileTemplate(message) {
        const source = readFileSync(join(__dirname, "../templates/email-shell.hbs"), "utf8");
        const template = handlebars.compile(source);
        return template({message});
    }

    async sendVerificationMail(email, token, newUser = false) {

        const newUserHtml = `
            <b>Welcome to Vetly ${email}</b> <br /> <br /> 
            Click link below to verify your account <br /> <br /> 
            <a href=${FRONTEND_URL}/verify-account/${token}>Verify</a>
        `;

        const oldUserHtml = `
            <b>Dear ${email}</b> <br /> <br /> 
            Click link below to verify your account <br /> <br /> 
            <a href=${FRONTEND_URL}/verify-account/${token}>Verify</a>
        `;

        const mailOption = {
            // eslint-disable-next-line quotes
            from: '"Vetly" support@ikecruz.dev',
            to: email,
            subject: newUser ? "Welcome to Vetly" : "Email verification token",
            html: this.compileTemplate(newUser ? newUserHtml : oldUserHtml)
        };

        const result = await this.transport.sendMail(mailOption);

        return result;

    }

    async sendPasswordResetMail(email, token) {

        const html = `
            <b>Click link below to reset your password </b> <br /> <br /> 
            <a href=${FRONTEND_URL}/reset-password/${token}>Change password</a>
        `;

        const mailOption = {
            // eslint-disable-next-line quotes
            from: '"Vetly" support@ikecruz.dev',
            to: email,
            subject: "Reset Password",
            html: this.compileTemplate(html)
        };

        return await this.transport.sendMail(mailOption);

    }

    async sendVettingEmail(email, token) {

        const html = `
            <b>Good day ${email}</b>
            <p>Click link below to Vet employee </p> <br />
            <a href=${FRONTEND_URL}/organization/${token}>Vet</a>
        `;

        const mailOption = {
            // eslint-disable-next-line quotes
            from: '"Vetly" support@ikecruz.dev',
            to: email,
            subject: "Vet Employee",
            html: this.compileTemplate(html)
        };

        return await this.transport.sendMail(mailOption);
    }

}