import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): string {
        return "Hello meetsin!! 과연 올바른";
    }
}
