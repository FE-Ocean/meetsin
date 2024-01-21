import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session from "express-session";
import passport from "passport"
import dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS 설정
    app.enableCors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    });

    app.use(session({
        secret: process.env.JWT_SECRET, // temp
        resave: false,
        saveUninitialized: false,
    }),)

    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser((user, done) => {
        done(null, user); 
    });

    await app.listen(8000);
}
bootstrap();
