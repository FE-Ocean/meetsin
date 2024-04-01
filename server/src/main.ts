import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import { ValidationPipe } from "@nestjs/common";

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(
        session({
            secret: process.env.SESSION_SECRET, // temp
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: false,
                maxAge: 30000,
            },
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    // CORS 설정
    app.enableCors({
        origin: process.env.SERVER_URL,
        methods: ["GET", "POST"],
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

    await app.listen(8000);
}
bootstrap();
