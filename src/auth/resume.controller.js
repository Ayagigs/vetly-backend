import { StatusCodes } from "http-status-codes";
import AuthService from "./auth.service";
import resumeService from "./resume.service";



export default class ResumeController {

    constructor () {
        this.resumeService = new resumeService();
    }

    createResume = async ( req, res, next ) => {
        try {

            const value = await this.resumeService.createResume(req.body);
            res.status(StatusCodes.CREATED).send(value);

        } catch (error) {
            next(error);
        }
    };
}