import HttpException from "../utils/exception";
import { StatusCodes } from "http-status-codes";
import AuthService from "./auth.service";

class UserService {
    constructor() {
        this.authService = new AuthService();
    }

    async register(req) {
        try {
            const newUser = await this.authService.register(req.body);

            return newUser;
        } catch (error) {
            throw new HttpException(
                error.status || StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            );
        }
    }
}

export default new UserService();
