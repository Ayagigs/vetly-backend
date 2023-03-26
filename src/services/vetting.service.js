/* eslint-disable no-dupe-keys */
import HttpException from "../utils/exception";
import { StatusCodes } from "http-status-codes";
import MailService from "./mail.service";
import Vetting from "../models/vetting.model";
import TokenService from "../services/token.service";
import ResumeService from "../services/resume.service";
import UserService from "../services/user.service";
import moment from "moment";
import mongoose from "mongoose";

export default class VettingService {

    constructor() {
        this.mailService = new MailService();
        this.tokenService = new TokenService();
        this.resumeService = new ResumeService();
        this.userService = new UserService();
    }

    async findOne(id) {

        const request = await Vetting.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "request_creator",
                    pipeline: [
                        {
                            $project: {
                                __v: 0,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "resumes",
                    localField: "resume_id",
                    foreignField: "_id",
                    as: "resume",
                    pipeline: [
                        {
                            $project: {
                                __v: 0,
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    __v: 0,
                }
            },
            {
                $set: {
                    request_creator: {
                        $first: "$request_creator"
                    },
                    resume: {
                        $first: "$resume"
                    }
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

    async list() {
        return Vetting.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "request_creator",
                    pipeline: [
                        {
                            $project: {
                                __v: 0,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "resumes",
                    localField: "resume_id",
                    foreignField: "_id",
                    as: "resume",
                    pipeline: [
                        {
                            $project: {
                                __v: 0,
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    __v: 0,
                }
            },
            {
                $set: {
                    request_creator: {
                        $first: "$request_creator"
                    },
                    resume: {
                        $first: "$resume"
                    }
                }
            }
        ]);
    }

    async listByUser(user_id) {
        return Vetting.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(user_id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "request_creator",
                    pipeline: [
                        {
                            $project: {
                                __v: 0,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "resumes",
                    localField: "resume_id",
                    foreignField: "_id",
                    as: "resume",
                    pipeline: [
                        {
                            $project: {
                                __v: 0,
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    __v: 0,
                }
            },
            {
                $set: {
                    request_creator: {
                        $first: "$request_creator"
                    },
                    resume: {
                        $first: "$resume"
                    }
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
        const resume_id = user.userType === "applicant" ?
            (await this.resumeService.listByUser(user)).id :
            (await this.resumeService.findOne(body.resume_id)).id;

        const requests = await Promise.all(body.emails.map(email => Vetting.create({ email, user_id: user.id, resume_id })));

        const tokens = await Promise.all(requests.map(request => this.tokenService.createToken(request.id, moment().add(15, "days").toDate())));

        await Promise.all(requests.map(request => {
            const token = tokens.find(t => t.creator_id = request.id);
            return this.mailService.sendVettingEmail(request.email, token.key);
        }));

        return "Emails sent out to orgs";

    }

    /**
     * It takes a token, validates it, finds the vetting request, finds the resume, finds the user that created the resume,
     * and returns the user and resume
     * @param request_token - The token that was sent to the user's email.
     * @returns An object with the user, resume, and token.
     */
    async getVettingRequest(request_token) {
        const validToken = await this.tokenService.findOne(request_token);
        const vetting_request = await this.findOne(validToken.creator_id);

        return vetting_request;
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
            { _id: validToken.creator_id },
            data,
            { new: true }
        );

        // TODO: NOTIFY REQUESTER ON VETTING UPDATE

        return request;
    }

    // async listRecentVetting(creator_id) {
    //     if (!creator_id) {
    //         throw new HttpException(
    //             StatusCodes.BAD_REQUEST,
    //             "Creator id is required"
    //         );
    //     }
    //     return await Vetting.find({ creator_id: creator_id }).sort({ created_at: -1 }).limit(10);
    // }

    // async getVettingCount(creator_id) {
    //     if (!creator_id) {
    //         throw new HttpException(
    //             StatusCodes.BAD_REQUEST,
    //             "Creator id is required"
    //         );
    //     }

    //     const vetting = await Vetting.find({ creator_id: creator_id });
    //     const successful = vetting.filter(v => v.status === "success").length;
    //     const failed = vetting.filter(v => v.status === "failed").length;
    //     const pending = vetting.filter(v => v.status === "pending").length;

    //     return { successful, failed, pending };
    // }

}