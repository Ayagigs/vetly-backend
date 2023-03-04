import UserController, { fetchAllUsers, fetchOneUserById } from "../controller/user.controller";
import schemaValidator from "../middlewares/validation.middleware";
import loginSchema from "../schemas/login.schema";




export default class UserRouter {

    constructor() {
        this.path = "/auth";
        this.router = Router();
        this.adminGuard = new AdminGuard();
        this.usercontroller = new UserController;
        this.initRoutes();
    }

    // route to fetch One user
    initRoutes() {
        this.router.get(
            `${this.path} /users/1`,
            schemaValidator(loginSchema, fetchOneUserById, "params"),
            this.authController.login
        );

        // fetch all users

        this.router.get(
            `${this.path} /users`,
            schemaValidator(loginSchema, fetchAllUsers, "params"),
            this.adminGuard.guard,
            this.authController.login
        );

    }

}