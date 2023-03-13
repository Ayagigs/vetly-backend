import { StatusCodes } from "http-status-codes";
import ResumeService from "../services/resume.service";



export default class ResumeController {

    constructor () {
        this.resumeService = new ResumeService();
    }

    create = async (req, res, next) => {
        try {
            
            const value = await this.resumeService.initResume(req.user);
            res.status(StatusCodes.CREATED).send(value);

        } catch (error) {
            next(error);
        }
    };

    updateResume = async ( req, res, next ) => {
        try {

            const value = await this.resumeService.updateResume(req.body);
            res.status(StatusCodes.CREATED).send(value);

        } catch (error) {
            next(error);
        }
    };

    findOne = async (req, res, next) => {

        try {
            
            const value = await this.resumeService.findOne(req.params.id);
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }

    };

    list = async (req, res, next) => {

        try {
            
            const value = await this.resumeService.listByUser(req.user);
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }

    };
}