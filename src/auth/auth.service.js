import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET_KEY } from "../config";
import User from "../models/user.model";
import HttpException from "../utils/exception";

export default class AuthService {

    async register(body) {
        const emailExists = await User.findOne({ "local.email": body.email });

        if (emailExists) {
            throw new HttpException(
                StatusCodes.CONFLICT,
                "User already exists"
            );
        }

        const localUser = {
            fullname: body.fullname,
            local: {
                email: body.email,
                password: body.password,
                email_verified: false
            },
            userType: body.user_type
        };

        let user = await User.findOne({ $or: [{ "google.email": localUser.local.email }, { "github.email": localUser.local.email }, { "linkedin.email": localUser.local.email }] });

        if (!user) {
            user = await User.create(localUser);
        } else {
            user = await User.findOneAndUpdate({ _id: user.id }, localUser, { new: true });
        }

        // TODO: SEND VERIFICATION EMAIL

        return user;

    }

    async login(body) {
        const user = await User.findOne({ "local.email": body.email, userType: body.user_type });

        const passwordMatch = await user.passwordMatch(body.password);

        if (!passwordMatch) {
            throw new HttpException(
                StatusCodes.UNAUTHORIZED,
                "Invalid Credentials"
            );
        }

        // TODO: CHECK IF USER IS VERIFIED

        const token = this.signJwt(user.id);

        return {
            user,
            token
        };

    }

    signJwt(id) {
        return jwt.sign(
            { id },
            JWT_SECRET_KEY,
            { expiresIn: JWT_EXPIRES_IN }
        );
    }

    verifyJwt(token) {
        return jwt.verify(token, JWT_SECRET_KEY);
    }

}