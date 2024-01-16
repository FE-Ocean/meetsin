import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session from "express-session";
import passport from "passport"

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS 설정
    app.enableCors({
        origin: [ "http://localhost:3000" ],
        methods: ["GET", "POST"],
        credentials: true,
    });

    app.use(session({
        secret: 'test',
        resave: false,
        saveUninitialized: false,
    }),)

    app.use(passport.initialize())
    app.use(passport.session())

    await app.listen(8000);
}
bootstrap();
