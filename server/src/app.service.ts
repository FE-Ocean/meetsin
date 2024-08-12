import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): string {
        return "Hello meetsin!! 구 스크립트에서 SSH Commands 위 스크립트 추가 후 스크립트 수정";
    }
}
