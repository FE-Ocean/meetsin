import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schema/user.schema";

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    createUser(userData: User) {
        return {
            ...userData,
        } as User
    }

    async findUserById(user_id: string) {
        const user = await this.userModel.findOne({ user_id });
        return user;
    }

    async saveUser(userData: User) {
        await this.userModel.create(userData);
    }
}