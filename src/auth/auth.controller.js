import { StatusCodes } from "http-status-codes";
import HttpException from "../utils/exception";

export default class AuthController {

    constructor () {
        
    }

    // TESTING ERROR HANDLING
    login = (_req, _res) => {

        throw new HttpException(
            StatusCodes.UNAUTHORIZED,
            "You can't post here mahn"
        );

    };

}