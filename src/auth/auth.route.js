import { Router } from "express";
import schemaValidator from "../middlewares/validation.middleware";
import changePasswordSchema from "../schemas/change-password.schema";
import loginSchema from "../schemas/login.schema";
import registerSchema from "../schemas/register.schema";
import thirdPartyAuthSchema from "../schemas/third-party-auth.schema";
import { emailSchema, tokenSchema } from "../schemas/token.schema";
import AuthController from "./auth.controller";
import GithubAuthStrategy from "./strategies/github.strategy";
import GoogleAuthStrategy from "./strategies/google.strategy";

export default class AuthRouter {

    constructor () {
        this.path = "/auth";
        this.router = Router();
        this.googleStrategy = new GoogleAuthStrategy();
        this.githubStrategy = new GithubAuthStrategy();
        this.authController = new AuthController();
        this.initRoutes();
    }

    initRoutes () {

        this.router.post(
            `${this.path}/login`,
            schemaValidator( loginSchema, "body" ),
            this.authController.login
        );

        this.router.post(
            `${this.path}/register`,
            schemaValidator( registerSchema, "body" ),
            this.authController.register
        );

        this.router.post(
            `${this.path}/verify`,
            schemaValidator( tokenSchema, "body" ),
            this.authController.verifyEmail
        );

        this.router.post(
            `${this.path}/verify/resend-token`,
            schemaValidator( emailSchema, "body" ),
            this.authController.sendToken
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

        this.router.get(
            `${this.path}/github`,
            schemaValidator( thirdPartyAuthSchema, "query" ),
            this.githubStrategy.authenticate
        );

        this.router.get(
            `${this.path}/github/callback`,
            this.githubStrategy.callback
        );

        this.router.post(
            `${this.path}/forgot-password`,
            schemaValidator( emailSchema, "body" ),
            this.authController.forgotPassword
        );

        this.router.post(
            `${this.path}/change-password`,
            schemaValidator( changePasswordSchema, "body" ),
            this.authController.changePassword
        );

    }

}