import { Router } from "express";
import VettingController from "../controllers/vetting.controller";
import BaseGuard from "../auth/guards/base.guard";
import AdminGuard from "../auth/guards/admin.guard";
import schemaValidator from "../middlewares/validation.middleware";
import vettingEmailsSchema from "../schemas/vetting-emails.schema";
import { tokenSchema } from "../schemas/general.schema";
import VettingResponseSchema from "../schemas/vetting-response.schema";

export default class VettingRouter {

    constructor() {
        this.path = "/vetting";
        this.router = Router();
        this.vettingController = new VettingController();
        this.baseGuard = new BaseGuard();
        this.adminGuard = new AdminGuard();
        this.initRoutes();
    }

    initRoutes() {

        this.router.get(
            `${this.path}`,
            this.baseGuard.guard,
            this.vettingController.listByUser("applicant")
        );

        this.router.get(
            `${this.path}/list`,
            this.adminGuard.guard,
            this.vettingController.list
        );

        this.router.get(
            `${this.path}/find/user/:id`,
            this.baseGuard.guard,
            this.vettingController.listByUser("admin")
        );

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

        this.router.post(
            `${this.path}/get-vetting-details`,
            schemaValidator(tokenSchema, "body"),
            this.vettingController.getVettingRequest
        );
        
        this.router.patch(
            `${this.path}/vetting-response`,
            schemaValidator(VettingResponseSchema, "body"),
            this.vettingController.updateVettingRequest
        );

    }

}