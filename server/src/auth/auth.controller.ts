import { Controller, Get, HttpStatus, Request, Response, UseGuards } from "@nestjs/common";
import { GoogleAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/common/decorators/user.decorator";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('login/google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Request() req) {}

    @Get('redirect/google')
    @UseGuards(GoogleAuthGuard)
    googleAuthRedirect(@Request() req: Request, @Response() res: Response) {
        return this.authService.googleSignIn(req, res)
    }

    @Get('login/google2')
    @UseGuards(AuthGuard("google"))
    async googleAuth2(@CurrentUser() user, @Response() res: Response) {
        return this.authService.googleSignIn2(user, res)
    }
}
