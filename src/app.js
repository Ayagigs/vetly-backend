import express, { json } from "express";
import { DB_URL, PORT } from "./config";
import cors from "cors";
import morganMiddleware from "./middlewares/morgan.middleware";
import errorMiddleware from "./middlewares/error.middleware";
import mongoose from "mongoose";
import { logger } from "./utils/logger";
import passport from "passport";

export default class App {

    constructor (routes) {
        this.app = express();
        this.port = PORT || 8080;
        this.initMiddlewares();
        this.initRoutes(routes);
        this.initErrorHandling();
        this.connectDb();
    }
    
    listen () {
        this.app.listen(PORT, () => {
            logger.info(`Server is running @ http://localhost:${this.port}`);
        });
    }

    initRoutes (routes) {
        this.app.get("/", (req, res) => res.send("Vetly Backend"));

        routes.forEach(route => {
            this.app.use("/api/v1" ,route.router);
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
        this.app.use(passport.initialize());
    }

    initErrorHandling () {
        this.app.use(errorMiddleware);
    }

}