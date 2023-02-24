import { Router } from "express";
import AuthController from "./auth.controller";
import GoogleAuthStrategy from "./strategies/google.strategy";

export default class AuthRouter {

    constructor () {
        this.path = "/auth";
        this.router = Router();
        this.googleStrategy = new GoogleAuthStrategy("test");
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
            this.googleStrategy.authenticate
        );

        this.router.get(
            `${this.path}/google/callback`,
            this.googleStrategy.callback
        );

    }

}