import { config } from "dotenv";

config();

export const {

    PORT,
    LOG_DIR,
    NODE_ENV,
    DB_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL

} = process.env;