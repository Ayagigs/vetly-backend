import App from "./app.js";
import AuthRouter from "./auth/auth.route.js";

function bootstrap() {

    const app = new App([
        new AuthRouter()
    ]);

    app.listen();

}

bootstrap();