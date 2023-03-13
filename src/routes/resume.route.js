import { Router } from "express";
import ResumeController from "../controllers/resume.controller";
import BaseGuard from "../auth/guards/base.guard";
import schemaValidator from "../middlewares/validation.middleware";
import resumeSchema from "../schemas/resume.schema";

export default class ResumeRouter {

    constructor () {
        this.path = "/resume";
        this.router = Router();
        this.resumeController = new ResumeController();
        this.baseGuard = new BaseGuard();
        this.initRoutes();
    }

    initRoutes () {

        this.router.get(
            this.path,
            this.baseGuard.guard,
            this.resumeController.list
        );

        this.router.get(
            `${this.path}/:id`,
            this.baseGuard.guard,
            this.resumeController.findOne
        );

        this.router.post(
            this.path,
            this.baseGuard.guard,
            this.resumeController.create
        );

        this.router.patch(
            `${this.path}/:id`,
            this.baseGuard.guard,
            schemaValidator( resumeSchema, "body" ),
            this.resumeController.updateResume
        );

    }

}