import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET_KEY } from "../config";

export default class AuthService {

    // constructor

    signJwt ( id  ) {
        return jwt.sign(
            {id},
            JWT_SECRET_KEY,
            { expiresIn: JWT_EXPIRES_IN }
        );
    }

    verifyJwt ( token ) {
        return jwt.verify(token, JWT_SECRET_KEY);
    }

}