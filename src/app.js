import express, { json } from "express";
import { DB_URL, PORT } from "./config";
import cors from "cors";
import morganMiddleware from "./middlewares/morgan.middleware";
import errorMiddleware from "./middlewares/error.middleware";
import mongoose from "mongoose";
import { logger, __dirname } from "./utils/logger";
import passport from "passport";
import { join } from "path";
import { stat } from "fs";

export default class App {

    constructor (routes) {
        this.app = express();
        this.port = PORT || 8080;
        this.initMiddlewares();
        this.initRoutes(routes);
        this.initErrorHandling();
        this.connectDb();
        this.readFiles();
    }
    
    listen () {
        this.app.listen(this.port, () => {
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

    readFiles () {
        this.app.use(function(req, res, next){
            var filePath = join(__dirname, "../../" + req.path);
            stat(filePath, function(err, fileInfo){
                if (err) {
                    next();
                    return;
                }
                if (fileInfo.isFile()) {
                    res.sendFile(filePath);
                }
                else{
                    next();
                }
            });
        });
    }

}