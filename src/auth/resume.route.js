import { Router } from "express";
import schemaValidator from "../middlewares/validation.middleware";
import resumeSchema from "../schemas/resume.schema";
import ResumeController from "./resume.controller";


export default class ResumeRouter {

    constructor () {
        this.path = "/resume";
        this.router = Router();
        this.resumeController = new ResumeController();
        this.initRoutes();
    }

    initRoutes () {

        this.router.post(
            `${this.path}/create/:id`,
            schemaValidator( resumeSchema, "body" ),
            this.resumeController.createResume
        );

    }

}