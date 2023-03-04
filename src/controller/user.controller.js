import { StatusCodes } from "http-status-codes";
import User from "../models/user.model";
import UserService from "../services/user.service";
import HttpException from "../utils/exception";


export default class UserController {
    constructor() {
        this.UserService = new UserService();
    }
    async getUserById(req) {
        const token = this.getTokenFromHeaders(req);
        if (!token) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                "Token not found"
            );
        }

        try {
            // Get the user details from the token
            const user = await this.getUser(token);

            // Get the user ID from the request parameters
            const userId = req.params.id;

            // Fetch the user by ID
            const foundUser = await User.findById(userId);

            // Check if the user exists
            if (!foundUser) {
                throw new HttpException(
                    StatusCodes.NOT_FOUND,
                    "User not found"
                );
            }

            // Check if the requesting user is authorized to access the user details
            if (user.role !== "admin" && user._id.toString() !== foundUser._id.toString()) {
                throw new HttpException(
                    StatusCodes.UNAUTHORIZED,
                    "You do not have permission to access this resource"
                );
            }

            return foundUser;
        } catch (error) {
            throw new HttpException(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Something went wrong"
            );
        }
    }


    getTokenFromHeaders(req) {
        const headersDetails = req.headers;
        const token = headersDetails["authorization"]?.split(" ")[1];
        return token;
    }
    async fetchAllUsers(req) {
        const token = this.getTokenFromHeaders(req);
        if (!token) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                "Token not found"
            );
        }

        try {
            // Get the user details from the token
            const user = await this.getUser(token);

            // Check if the user has the necessary permissions to fetch all users
            if (user.role !== "admin") {
                throw new HttpException(
                    StatusCodes.UNAUTHORIZED,
                    "You do not have permission to access this resource"
                );
            }

            // Fetch all users
            const users = await User.find();

            return users;
        } catch (error) {
            throw new HttpException(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Something went wrong"
            );
        }
    }


}





