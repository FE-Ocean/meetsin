import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { LoginRequest } from "src/types/request.type";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("/login/google")
    @UseGuards(AuthGuard("google"))
    googleAuth(@Req() req) {}

    @Get("/redirect/google")
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: LoginRequest, @Res() res: Response) {
        const token = await this.authService.signIn(req, res)
        res.cookie('access_token', token.access_token, {httpOnly: true})
        res.redirect(process.env.CLIENT_URL)
    }

    @Get("/login/kakao")
    @UseGuards(AuthGuard("kakao"))
    kakaoAuth(@Req() req) {}

    @Get("/redirect/kakao")
    @UseGuards(AuthGuard("kakao"))
    async kakaoAuthRedirect(@Req() req: LoginRequest, @Res() res: Response) {
        const token = await this.authService.signIn(req, res)
        res.cookie('access_token', token.access_token, {httpOnly: true})
        res.redirect(process.env.CLIENT_URL)
    }
}