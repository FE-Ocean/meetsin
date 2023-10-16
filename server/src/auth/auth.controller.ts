import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequestDto } from "src/dto/login.request.dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post("/login")
    login(@Body() data: LoginRequestDto) {
        return this.authService.login(data);
    }
}
