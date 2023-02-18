import express, { json } from "express";
import { PORT } from "./config";
import cors from "cors";
import morganMiddleware from "./middlewares/morgan.middleware";
import errorMiddleware from "./middlewares/error.middleware";

export default class App {

    constructor () {
        this.app = express();
        this.port = PORT || 8080;
        this.initMiddlewares();
        this.initErrorHandling();
    }
    
    listen () {
        this.app.listen(PORT, () => {
            console.log("Server is running");
        });
    }

    initMiddlewares () {
        this.app.use(json());
        this.app.use(cors());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morganMiddleware);
    }

    initErrorHandling () {
        this.app.use(errorMiddleware);
    }

}