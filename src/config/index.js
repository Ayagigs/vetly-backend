import { config } from "dotenv";

config();

export const {

    PORT,
    LOG_DIR,
    NODE_ENV,
    DB_URL,
    JWT_SECRET_KEY,
    JWT_EXPIRES_IN,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL,
    FRONTEND_URL,
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USERNAME,
    MAIL_PASSWORD

} = process.env;