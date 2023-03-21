import { Router } from "express";
import VettingController from "../controllers/vetting.controller";
import BaseGuard from "../auth/guards/base.guard";
import schemaValidator from "../middlewares/validation.middleware";
import vettingEmailsSchema from "../schemas/vetting-emails.schema";

export default class VettingRouter {

    constructor() {
        this.path = "/vetting";
        this.router = Router();
        this.vettingController = new VettingController();
        this.baseGuard = new BaseGuard();
        this.initRoutes();
    }

    initRoutes() {

        this.router.get(
            `${this.path}/resume/:id`,
            this.baseGuard.guard,
            this.vettingController.fetchEmailsFromResume
        );

        this.router.post(
            `${this.path}/send-mails`,
            this.baseGuard.guard,
            schemaValidator(vettingEmailsSchema, "body"),
            this.vettingController.sendVettingEmail
        );

    }

}