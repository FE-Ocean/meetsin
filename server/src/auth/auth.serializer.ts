import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UsersRepository } from "src/users/users.repository";

@Injectable()
export class AuthSerializer extends PassportSerializer {
    constructor(private readonly usersRepository: UsersRepository,) {
        super();
    }

    serializeUser(user: any, done: Function) {
        console.log("serializer: " + JSON.stringify(user))
        done(null, user)
    }

    async deserializeUser(payload: any, done: Function) {
        console.log("deserializer: " + JSON.stringify(payload))
        const user = await this.usersRepository.findUserById(payload.id)
        console.log(user)
        return done(null, payload)
    }
}