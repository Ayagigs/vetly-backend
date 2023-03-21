import Resume from "../models/resume.model";
import HttpException from "../utils/exception";
import { StatusCodes } from "http-status-codes";
import MailService from "./mail.service";
import Vetting from "../models/vetting.model";
import Token from "../models/token.model";

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

    async sendVettingEmail(user_id, emails) {

        if (!emails || emails.length === 0) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                "No emails found"
            );
        }
        
        const requests = await Promise.all(emails.map(email => Vetting.create({ email, creator_id: user_id })));

        const tokens = await Promise.all(requests.map(request => Token.create({ creator_id: request.id })));

        await Promise.all(requests.map(request => {
            const token = tokens.find(t => t.creator_id = request.id);
            return this.mailService.sendVettingEmail(request.email, token.key);
        }));

        return "Emails sent out to orgs";

    }

}