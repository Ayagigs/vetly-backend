import { StatusCodes } from "http-status-codes";
import User from "../models/user.model";
// import HttpException from "../utils/exception";

export default class AuthController {

    constructor () {
        
    }

    // TESTING ERROR HANDLING
    login = async (_req, res) => {
        const users = await User.find({});
        res.status(StatusCodes.OK).send(users);
    };

}