import { StatusCodes } from "http-status-codes";
import VettingService from "../services/vetting.service";



export default class VettingController {

    constructor() {
        this.vettingService = new VettingService();
    }

    list = async (req, res, next) => {
        try {
            
            const value = await this.vettingService.list();
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }
    };

    listByUser = (role) => 
        async (req, res, next) => {
            try {
                
                const user_id = role === "applicant" ? req.user.id : req.params.id;
                const value = await this.vettingService.listByUser(user_id);
                res.status(StatusCodes.OK).send(value);
                
            } catch (error) {
                next(error);
            }
        };

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

            const value = await this.vettingService.sendVettingEmail(req.user, req.body);
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }
    };

    getVettingRequest = async (req, res, next) => {
        try {

            const value = await this.vettingService.getVettingRequest(req.body.token);
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }
    };

    updateVettingRequest = async (req, res, next) => {
        try {
            
            const value = await this.vettingService.updateVetting(req.body);
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }
    };

}