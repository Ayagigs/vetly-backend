import { Router } from "express";
import AuthController from "./auth.controller";
import GoogleAuthStrategy from "./strategies/google.strategy";

export default class AuthRouter {

    constructor () {
        this.path = "/auth";
        this.router = Router();
        this.applicantGoogleStrategy = new GoogleAuthStrategy("applicant");
        this.businessGoogleStrategy = new GoogleAuthStrategy("business");
        this.authController = new AuthController();
        this.initRoutes();
    }

    initRoutes () {

        this.router.get(
            `${this.path}/login`, 
            this.authController.login
        );

        this.router.get(
            `${this.path}/google/applicant`,
            this.applicantGoogleStrategy.authenticate
        );

        this.router.get(
            `${this.path}/google/business`,
            this.businessGoogleStrategy.authenticate
        );

        this.router.get(
            `${this.path}/google/callback`,
            this.businessGoogleStrategy.callback
        );

    }

}