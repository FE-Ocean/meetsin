import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): string {
        return "Hello meetsin!! 권한 설정";
    }
}
