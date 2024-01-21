import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/schema/user.schema";
import { UsersRepository } from "src/users/users.repository";
import dotenv from "dotenv";
import { Response } from "express";

dotenv.config();

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private jwtService: JwtService,
    ) {}

    async googleSignIn(userData: User, res: Response) {
        try {
            if(!userData){
                throw new BadRequestException('Unauthenticated');
            }

            const user = await this.usersRepository.findUserById(userData.user_id);
            if(!user) {
                return this.googleSignUp(userData);
            }

            // const token = this.jwtService.sign({ sub: user.user_id })
            const accessToken = user.access_token;
            res.status(HttpStatus.OK).cookie("access_token", accessToken, {
                maxAge: 60 * 60 * 24 * 30,
                sameSite: true,
                secure: false,
            })
            // refresh token 추가 여부?
            res.redirect(process.env.CLIENT_URL)
        } catch(error) {
            throw new ForbiddenException("Signin Failed");
        }
    }

    async googleSignUp(userData: User) {
        const user = this.usersRepository.createUser(userData);
        await this.usersRepository.saveUser(user);
    }
}