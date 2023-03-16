import { StatusCodes } from "http-status-codes";
import VettingService from "../services/vetting.service";



export default class VettingController {

    constructor() {
        this.vettingService = new VettingService();
    }

    fetchEmailsFromResume = async (req, res, next) => {
        try {

            const value = await this.vettingService.fetchEmailsFromResume(req.params.id);
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }
    };

    sendVettingEmail = async (req, res, next) => {
        try {

            const value = await this.vettingService.sendVettingEmail(req.body);
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }
    };

}