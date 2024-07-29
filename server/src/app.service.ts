import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): string {
        return "Hello meetsin!! known_hosts 넣";
    }
}
