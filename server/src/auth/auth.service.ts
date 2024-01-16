import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginRequestDto } from "src/dto/login.request.dto";
import { User } from "src/schema/user.schema";
import { UsersRepository } from "src/users/users.repository";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private jwtService: JwtService,
    ) {}

    // https://medium.com/@flavtech/google-oauth2-authentication-with-nestjs-explained-ab585c53edec 참고


    async testSignin(userData: User) {
        try {
            
            if(!userData){
                throw new BadRequestException('Unauthenticated')
            }

            const user = await this.usersRepository.findUserById(userData.user_id)
            if(!user) {
                return this.googleSignUp(userData);
            }

            const token = this.jwtService.sign({sub:user.user_id, email:user.email})
            // res.status(HttpStatus.OK).cookie('access_token', token, {
            //     maxAge: 60 * 60 * 24 * 30,
            //     sameSite: true,
            //     secure: false,
            // })
        } catch(error) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'signin issue'
            }, HttpStatus.CONFLICT)
        }
    }

    async googleSignIn(req, res) {
        try {
            const userData = req.user as User;
            if(!userData){
                throw new BadRequestException('Unauthenticated')
            }

            const user = await this.usersRepository.findUserById(userData.user_id)
            if(!user) {
                return this.googleSignUp(userData);
            }

            const token = this.jwtService.sign({sub:user.user_id, email:user.email})
            res.status(HttpStatus.OK).cookie('access_token', token, {
                maxAge: 60 * 60 * 24 * 30,
                sameSite: true,
                secure: false,
            })
        } catch(error) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'signin issue'
            }, HttpStatus.CONFLICT)
        }
    }

    async googleSignUp(userData) {
        const user = this.usersRepository.createUser(userData)
        await this.usersRepository.saveUser(user)
    }
}