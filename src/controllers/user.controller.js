import { StatusCodes } from "http-status-codes";
import UserService from "../services/user.service";


export default class UserController {

    constructor() {
        this.userService = new UserService();
    }

    list = async (_req, res, next) => {
        try {

            const value = await this.userService.list();
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }
    };

    listByRole = async (req, res, next) => {
        
        try {
            
            const value = await this.userService.listByRole(req.query.user_type);
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }

    };

    findOne = async (req, res, next) => {

        try {
            
            const value = await this.userService.findById(req.params.id);
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }

    };

    search = async (req, res, next) => {

        try {
            
            const value =  await this.userService.search(req.query.keyword);
            res.status(StatusCodes.OK).send(value);

        } catch (error) {
            next(error);
        }

    };

}





