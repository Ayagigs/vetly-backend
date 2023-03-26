/* eslint-disable no-dupe-keys */
import HttpException from "../utils/exception";
import { StatusCodes } from "http-status-codes";
import MailService from "./mail.service";
import Vetting from "../models/vetting.model";
import TokenService from "../services/token.service";
import ResumeService from "../services/resume.service";
import UserService from "../services/user.service";
import moment from "moment";

export default class VettingService {

    constructor() {
        this.mailService = new MailService();
        this.tokenService = new TokenService();
        this.resumeService = new ResumeService();
        this.userService = new UserService();
    }

    async findOne (id) {
        const request = Vetting.aggregate([
            {
                $match: {
                    _id: id
                },
                $lookup: {
                    from: "user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "request_creator"
                },
                $lookup: {
                    from: "resumes",
                    localField: "resume_id",
                    foreignField: "_id",
                    as: "resume"
                }
            }
        ]);

        if (!request) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                "Record not found"
            );
        }

        return request[0];
    }

    async list () {
        return Vetting.aggregate([
            {
                $lookup: {
                    from: "user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "request_creator"
                },
                $lookup: {
                    from: "resumes",
                    localField: "resume_id",
                    foreignField: "_id",
                    as: "resume"
                }
            }
        ]);
    }

    async listByUser (user_id) {
        return Vetting.aggregate([
            {
                $match: {
                    user_id: user_id
                },
                $lookup: {
                    from: "user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "request_creator"
                },
                $lookup: {
                    from: "resumes",
                    localField: "resume_id",
                    foreignField: "_id",
                    as: "resume"
                }
            }
        ]);
    }

    /**
     * It fetches a resume by id, then fetches the work experience from that resume, then fetches the
     * email addresses from the work experience, and finally returns the email addresses
     * @param id - The id of the resume to fetch emails from
     * @returns An array of emails
     */
    async fetchEmailsFromResume(id) {

        const resume = await this.resumeService.findOne(id);

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

    /**
     * It takes in a user and a body, and then creates a vetting request for each email in the body,
     * and then sends out an email to each email in the body with a link to the vetting request
     * @param user - The user object that is passed in from the controller.
     * @param body - {
     * @returns A success message
     */
    async sendVettingEmail(user, body) {

        if (!body.emails || body.length === 0) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                "No emails found"
            );
        }

        /* This is checking if the user is an applicant or an org. If the user is an applicant, then
        the resume_id is the user_resume.id. If the user is an org, then the resume_id is the
        body.resume_id. */
        const resume_id = user.user_type === "applicant" ? 
            (await this.resumeService.listByUser(user)).id : 
            (await this.resumeService.findOne(body.resume_id)).id;
        
        const requests = await Promise.all(body.emails.map(email => Vetting.create({ email, user_id: user.id, resume_id  })));

        const tokens = await Promise.all(requests.map(request => this.tokenService.createToken(request.id, moment().add(15, "days").toDate())));

        await Promise.all(requests.map(request => {
            const token = tokens.find(t => t.creator_id = request.id);
            return this.mailService.sendVettingEmail(request.email, token.key);
        }));

        return "Emails sent out to orgs";

    }

    /**
     * It takes a token, validates it, finds the vetting request, finds the resume, finds the user that created the resume,
     * creates a new token, and returns the user, resume, and token
     * @param request_token - The token that was sent to the user's email.
     * @returns An object with the user, resume, and token.
     */
    async getVettingRequest(request_token) {
        const validToken = await this.tokenService.validateToken(request_token);
        const vetting_request = await this.findOne(validToken.creator_id);

        const resume = await this.resumeService.findOne(vetting_request.id);
        const user = await this.userService.findById(resume.user_id);

        const token = (await this.tokenService.createToken(resume.id)).key;

        return {
            user,
            resume,
            token
        };
    }

    /**
     * It takes a token and a status and updates the vetting status of the request which created the token
     * @param body - The body of the request.
     * @returns The request is being returned.
     */
    async updateVetting(body) {
        const validToken = await this.tokenService.validateToken(body.token);

        const data = {
            status: body.status
        };

        if (body.reason && body.reason !== "") {
            data.reason = body.reason;
        }

        const request = await Vetting.findOneAndUpdate(
            {_id: validToken.creator_id},
            data,
            { new: true }
        );

        // TODO: NOTIFY REQUESTER ON VETTING UPDATE

        return request;
    }

}