import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET_KEY } from "../config";
import User from "../models/user.model";
import MailService from "../services/mail.service";
import TokenService from "../services/token.service";
import HttpException from "../utils/exception";
import bcrypt from "bcrypt";

export default class AuthService {

    constructor () {
        this.mailService = new MailService();
        this.tokenService = new TokenService();
    }

    // METHODS USED BY CONTROLLER

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

        await this.sendVerificationToken({ email: user.local.email });

        return user;

    }

    async login(body) {
        const user = await User.findOne({ "local.email": body.email, userType: body.user_type });

        if (!user) {
            throw new HttpException(
                StatusCodes.UNAUTHORIZED,
                "Invalid Credentials"
            );
        }

        const passwordMatch = await user.passwordMatch(body.password);

        if (!passwordMatch) {
            throw new HttpException(
                StatusCodes.UNAUTHORIZED,
                "Invalid Credentials"
            );
        }
        
        if (!user.local.email_verified) {

            await this.sendVerificationToken({email: user.local.email});

            throw new HttpException(
                StatusCodes.CONFLICT,
                "Email not verified"
            );
        }

        const token = this.signJwt(user.id);

        return {
            user,
            token
        };

    }

    async sendVerificationToken (body) {

        const user = await User.findOne({ "local.email": body.email });

        if (!user) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                "User not found"
            );
        }

        const token = await this.tokenService.createToken(user.id);
        
        await this.mailService.sendVerificationMail(user.local.email, token.key);

        return `Token Sent to ${body.email}`;

    }

    async verifyEmail (body) {

        const token = await this.tokenService.validateToken(body.token);

        await User.findOneAndUpdate({ _id: token.creator_id }, {"local.email_verified": true});

        return "Email Verified";

    }

    async forgotPassword (body) {

        const user = await User.findOne({ "local.email": body.email });

        if (!user) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                "User not found"
            );
        }

        const token = await this.tokenService.createToken(user.id);
        
        await this.mailService.sendPasswordResetMail(user.local.email, token.key);

        return `Token Sent to ${body.email}`;

    }

    async changePassword (body) {

        const token = await this.tokenService.validateToken(body.token);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);

        const user = await User.findOneAndUpdate({ _id: token.creator_id }, {
            "local.password": hashedPassword
        }, {new: true});

        return user;

    }

    // METHODS - HELPERS

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