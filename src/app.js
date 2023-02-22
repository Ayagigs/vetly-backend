import express, { json } from "express";
import { DB_URL, PORT } from "./config";
import cors from "cors";
import morganMiddleware from "./middlewares/morgan.middleware";
import errorMiddleware from "./middlewares/error.middleware";
import mongoose from "mongoose";
import { logger } from "./utils/logger";

export default class App {

    constructor () {
        this.app = express();
        this.port = PORT || 8080;
        this.initMiddlewares();
        this.connectDb();
        this.initErrorHandling();
    }
    
    listen () {
        this.app.listen(PORT, () => {
            logger.info(`Server is running @ http://localhost:${this.port}`);
        });
    }

    connectDb () {
        try {
            mongoose.set("strictQuery", false);
            mongoose.connect(DB_URL);
            logger.info("Database connected");
        } catch (error) {
            logger.error(error);
        }
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