import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): string {
        return "Hello meetsin!! 실행 성공부터";
    }
}
