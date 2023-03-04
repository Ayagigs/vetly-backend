import App from "./app.js";
import AuthRouter from "./auth/auth.route.js";
import ResumeRouter from "./auth/resume.route.js";

function bootstrap() {

    const app = new App([
        new AuthRouter(),
        new ResumeRouter()
    ]);

    app.listen();

}

bootstrap();