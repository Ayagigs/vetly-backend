import { config } from "dotenv";

config();

export const {
    PORT,
    LOG_DIR,
    NODE_ENV
} = process.env;