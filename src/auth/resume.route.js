import { Router } from "express";
import schemaValidator from "../middlewares/validation.middleware";
import AdminGuard from "./guards/admin.guard";
import ResumeController from "./resume.controller";

export default class ResumeRouter {

    constructor () {
        this.path = "/resume";
        this.router = Router();
        this.resumeController = new ResumeController();
        this.adminGuard = new AdminGuard();
        this.initRoutes();
    }

    initRoutes () {

        this.router.post(
            `${this.path}/resume`,
            schemaValidator( resumeSchema, this.adminGuard, "body" ),
            this.resumeController.createResume
        );

    }

}