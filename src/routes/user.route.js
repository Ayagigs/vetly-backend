import { Router } from "express";
import BaseGuard from "../auth/guards/base.guard";
import UserController from "../controllers/user.controller";
import schemaValidator from "../middlewares/validation.middleware";
import { mongooseIdSchema, searchSchema } from "../schemas/general.schema";
import roleSchema from "../schemas/role.schema";

export default class UserRouter {

    constructor () {
        this.path = "/users";
        this.router = Router();
        this.userController = new UserController();
        this.baseGuard = new BaseGuard();
        this.initRoutes();
    }

    initRoutes () {

        this.router.get(
            this.path,
            this.baseGuard.guard,
            schemaValidator( roleSchema, "query" ),
            this.userController.listByRole
        );

        this.router.get(
            `${this.path}/:id`,
            this.baseGuard.guard,
            schemaValidator( mongooseIdSchema, "params" ),
            this.userController.findOne
        );

        this.router.get(
            `${this.path}/search`,
            this.baseGuard.guard,
            schemaValidator( searchSchema, "query" ),
            this.userController.search
        );

    }

}