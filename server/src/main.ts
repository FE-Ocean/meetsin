import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS 설정
    app.enableCors({
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true,
        exposedHeaders: ['Authorization']
    });

    app.use(passport.initialize())
    
    await app.listen(8000);
}
bootstrap();
