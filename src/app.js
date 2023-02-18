import express, { json } from "express"
import { PORT } from "./config"
import cors from "cors"

export default class App {

    constructor () {
        this.app = express()
        this.port = PORT || 3010
        this.initMiddlewares()
    }
    
    listen () {
        this.app.listen(PORT, () => {
            console.log("Server is running")
        })
    }

    initMiddlewares () {
        this.app.use(json());
        this.app.use(cors());
        this.app.use(express.urlencoded({ extended: true }));
    }

}