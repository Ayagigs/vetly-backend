import { Router } from "express";
import schemaValidator from "../middlewares/validation.middleware";
import thirdPartyAuthSchema from "../schemas/third-party-auth.schema";
import AuthController from "./auth.controller";
import GoogleAuthStrategy from "./strategies/google.strategy";

export default class AuthRouter {

    constructor () {
        this.path = "/auth";
        this.router = Router();
        this.googleStrategy = new GoogleAuthStrategy();
        this.authController = new AuthController();
        this.initRoutes();
    }

    initRoutes () {

        this.router.get(
            `${this.path}/login`, 
            this.authController.login
        );

        this.router.get(
            `${this.path}/google`,
            schemaValidator( thirdPartyAuthSchema, "query" ),
            this.googleStrategy.authenticate
        );

        this.router.get(
            `${this.path}/google/callback`,
            this.googleStrategy.callback
        );

    }

}