import App from "./app.js";
import AuthRouter from "./auth/auth.route.js";
import UserRouter from "./routes/user.route.js";

function bootstrap() {

    const app = new App([
        new AuthRouter(),
        new UserRouter()
    ]);

    app.listen();

}

bootstrap();