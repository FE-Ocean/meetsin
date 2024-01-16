import { Controller, Get, HttpStatus, Request, Response, UseGuards } from "@nestjs/common";
import { GoogleAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

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
}
