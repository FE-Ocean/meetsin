import { Controller, Get, Req, Res, Session, UseGuards } from "@nestjs/common";
import { GoogleAuthGuard, KakaoAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { Response } from "express";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("/login/google")
    @UseGuards(GoogleAuthGuard)
    googleAuth(@Req() req) {}

    @Get("/redirect/google")
    @UseGuards(GoogleAuthGuard)
    // googleAuthRedirect(@CurrentUser() user, @Res() res: Response, @Session() session) {
        // console.log("user on controller: " + JSON.stringify(user))
        // return this.authService.signIn(user, res);
    googleAuthRedirect(@Req() req, @Res() res: Response, @Session() session) {
        console.log(req.user)
        req.session.user = req.user
        this.authService.signIn(req.user, res);
        // return {user, sessionId: session.id}
    }

    @Get("/login/kakao")
    @UseGuards(KakaoAuthGuard)
    kakaoAuth(@Req() req) {}

    @Get("/redirect/kakao")
    @UseGuards(KakaoAuthGuard)
    kakaoAuthRedirect(@CurrentUser() user, @Res() res: Response) {
        return this.authService.signIn(user, res);
    }
}