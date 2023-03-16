import Resume from "../models/resume.model";
import HttpException from "../utils/exception";
import { StatusCodes } from "http-status-codes";
import MailService from "./mail.service";



export default class VettingService {

    constructor() {
        this.mailService = new MailService();
    }

    async fetchEmailsFromResume(id) {

        const resume = await Resume.findOne({
            _id: id
        });

        if (!resume) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                "Resume not found"
            );
        }

        const work_experience = resume.work_experience;

        if (!work_experience || work_experience.length === 0) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                "No work experience found"
            );
        }

        const emails = work_experience.map((item) => {
            return item.email_address;
        });

        if (!emails || emails.length === 0) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                "No emails found"
            );
        }

        return emails;

    }

    async sendVettingEmail(body) {

        const emails = body.emails;
        if (!emails || emails.length === 0) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                "No emails found"
            );
        }
        console.log(emails);

        await emails.map(email => this.mailService.sendVettingEmail(email));

        return `Emails sent to ${emails}`;

    }


}