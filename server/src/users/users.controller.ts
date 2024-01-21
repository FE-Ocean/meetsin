import { Body, Controller, Get, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { LoginRequestDto } from "src/dto/login.request.dto";
import { AuthService } from "src/auth/auth.service";

@Controller("users")
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {}

    // @Post("/login")
    // login(@Body() data: LoginRequestDto) {
    //     return this.authService.login(data);
    // }
}