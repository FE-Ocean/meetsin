import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { LoginRequest } from "src/types/request.type";
import { JwtGuard } from "./auth.guard";
import { UsersService } from "src/users/users.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UsersService) {}

    @Get("/login/google")
    @UseGuards(AuthGuard("google"))
    googleAuth(@Req() req) {}

    @Get("/redirect/google")
    @UseGuards(AuthGuard("google"))
    async googleAuthRedirect(@Req() req: LoginRequest, @Res() res: Response) {
        const { access_token } = await this.authService.signIn(req, res);
        res.cookie('access_token', access_token, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
        });
        res.redirect(process.env.CLIENT_URL);
    }

    @Get("/login/kakao")
    @UseGuards(AuthGuard("kakao"))
    kakaoAuth(@Req() req) {}

    @Get("/redirect/kakao")
    @UseGuards(AuthGuard("kakao"))
    async kakaoAuthRedirect(@Req() req: LoginRequest, @Res() res: Response) {
        const { access_token } = await this.authService.signIn(req, res);
        res.cookie('access_token', access_token, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
        });
        res.redirect(process.env.CLIENT_URL);
    }

    // 토큰으로 유저 정보 가져오기
    @Get("/user")
    @UseGuards(JwtGuard)
    async login(@Req() req: LoginRequest, @Res() res: Response) {
        const user = this.userService.entityToDto(req.user);
        res.json(user);
    }
}