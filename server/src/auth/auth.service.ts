import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "src/schema/user.schema";
import { UsersRepository } from "src/users/users.repository";
import dotenv from "dotenv";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { LoginRequest } from "src/types/request.type";

dotenv.config();

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(req: LoginRequest, res: Response) {
        try {
            const userData = req.user as User

            if(!userData){
                throw new BadRequestException('Unauthenticated');
            }

            const user = await this.usersRepository.findUserById(userData.user_id);

            if(!user) {
                return this.signUp(userData);
            }
            
            const jwtPayload = {
                id: user.user_id,
                email: user.email,
                userName: user.user_name
            }
            
            return {
                access_token: this.jwtService.sign(jwtPayload)
            }
        } catch(error) {
            throw new ForbiddenException("Signin Failed");
        }
    }

    async signUp(userData: User) {
        const user = this.usersRepository.createUser(userData);
        await this.usersRepository.saveUser(user);
        return user;
    }
}