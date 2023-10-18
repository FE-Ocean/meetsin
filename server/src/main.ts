import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS 설정
    app.enableCors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    });

    await app.listen(8000);
}
bootstrap();
