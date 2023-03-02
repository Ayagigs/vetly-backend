import { StatusCodes } from "http-status-codes";
import moment from "moment";
import Token from "../models/token.model";
import HttpException from "../utils/exception";

export default class TokenService {

    async createToken (creator_id) {

        const token = await Token.create({ creator_id: creator_id });

        return token;

    }

    /**
     * If the token is not found, or if the token is expired, throw an error.
     * @param token - The token that was sent in the request
     * @returns The token that was found.
     */
    async validateToken (token) {

        const foundToken = await Token.findOne({ key: token, used: false });

        if (!foundToken) {
            throw new HttpException(
                StatusCodes.UNAUTHORIZED,
                "Invalid Token"
            );
        }

        if (moment(foundToken.expires).isSameOrAfter(Date.now())) {
            throw new HttpException(
                StatusCodes.UNAUTHORIZED,
                "Invalid Token"
            );
        }

        await foundToken.flagUsed();

        return foundToken;

    }

}