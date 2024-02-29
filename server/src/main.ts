import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS 설정
    app.enableCors({
        origin: process.env.SERVER_URL,
        methods: ["GET", "POST"],
        credentials: true,
    });
    await app.listen(8000);
}
bootstrap();
