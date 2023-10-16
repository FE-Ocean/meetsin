import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginRequestDto } from "src/dto/login.request.dto";
import { User } from "src/schema/user.schema";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private jwtService: JwtService,
    ) {}

    async login(data: LoginRequestDto) {
        const { user_id, password } = data;

        const user = await this.userModel.findOne({ user_id });

        if (user && user.password === password) {
            const payload = {
                user_id,
                user_name: user.user_name,
                profile_img: user.profile_img,
                character: user.character,
            };
            const token = this.jwtService.sign(payload);
            return { token };
        } else {
            throw new UnauthorizedException("아이디나 비밀번호를 확인해주세요.");
        }
    }
}
