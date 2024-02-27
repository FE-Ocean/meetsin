import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session from "express-session";
import passport from "passport"
import dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(session({
        secret: process.env.SESSION_SECRET, // temp
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 30000,
        },
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    // CORS 설정
    app.enableCors({
        origin: process.env.SERVER_URL,
        methods: ["GET", "POST"],
        credentials: true,
    });
    await app.listen(8000);
}
bootstrap();
