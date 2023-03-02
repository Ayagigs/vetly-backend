import { StatusCodes } from "http-status-codes";
import AuthService from "./auth.service";

export default class AuthController {

    constructor () {
        this.authService = new AuthService();
    }

    register = async ( req, res, next ) => {
        try {

            const value = await this.authService.register(req.body);
            res.status(StatusCodes.CREATED).send(value);

        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            
            const value = await this.authService.login(req.body);
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }

    };

    verifyEmail = async (req, res, next) => {
        try {

            const value = await this.authService.verifyEmail(req.body);
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }
    };

    sendToken = async ( req, res, next ) => {
        try {

            const value = await this.authService.sendVerificationToken(req.body);
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }
    };

}