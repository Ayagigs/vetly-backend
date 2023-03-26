import { StatusCodes } from "http-status-codes";
import moment from "moment";
import Token from "../models/token.model";
import HttpException from "../utils/exception";

export default class TokenService {

    async createToken (creator_id, expires_in = moment().add(15, "m").toDate()) {

        const token = await Token.create({ creator_id: creator_id, expires: expires_in });

        return token;

    }

    async findOne (token) {
        const foundToken = await Token.findOne({ key: token, used: false });

        if (!foundToken) {
            throw new HttpException(
                StatusCodes.UNAUTHORIZED,
                "Invalid Token"
            );
        }

        return foundToken;
    }

    /**
     * If the token is not found, or if the token is expired, throw an error.
     * @param token - The token that was sent in the request
     * @returns The token that was found.
     */
    async validateToken (token) {

        const foundToken = await this.findOne(token);

        if (!moment(foundToken.expires).isSameOrAfter(Date.now())) {
            throw new HttpException(
                StatusCodes.UNAUTHORIZED,
                "Invalid Token"
            );
        }

        await foundToken.flagUsed();

        return foundToken;

    }

}