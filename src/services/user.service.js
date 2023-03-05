import User from "../models/user.model";
import HttpException from "../utils/exception";
import { StatusCodes } from "http-status-codes";

export default class UserService {
    
    async list () {
        return await User.find({});
    }

    async listByRole (role) {
        return await User.find({
            userType: role
        });
    }

    async search (keyword) {

        return await User.find({
            $or: [
                {fullname: { $regex: keyword }},
                { "local.email": { $regex: keyword } },
                { "github.email": { $regex: keyword } },
                { "google.email": { $regex: keyword } },
            ],
        });

    }

    async findById (id) {

        const user = await User.findOne({ _id: id });

        if (!user) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                "Record not found"
            );
        }

        return user;

    }

}
