import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginRequestDto } from "src/dto/login.request.dto";
import { UsersRepository } from "src/users/users.repository";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private jwtService: JwtService,
    ) {}

    async login(data: LoginRequestDto) {
        const { user_id, password } = data;

        const user = await this.usersRepository.findUserById(user_id);

        if (user && user.password === password) {
            const payload = {
                user_id,
                user_name: user.user_name,
                profile_img: user.profile_img,
                character: user.character,
            };
            const token = this.jwtService.sign(payload);
            return { token, user_name: user.user_name };
        } else {
            throw new UnauthorizedException("아이디나 비밀번호를 확인해주세요.");
        }
    }
}
