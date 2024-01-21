import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { GoogleAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { Response } from "express";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("/login/google")
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req) {}

    @Get("/redirect/google")
    @UseGuards(GoogleAuthGuard)
    googleAuthRedirect(@CurrentUser() user, @Res() res: Response) {
        return this.authService.googleSignIn(user, res);
    }
}