import { Controller } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthService } from "../auth/auth.service";

@Controller("users")
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {}
}
