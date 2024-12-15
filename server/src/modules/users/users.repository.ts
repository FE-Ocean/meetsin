import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "src/modules/users/schemas/user.schema";

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    createUser(userData: User) {
        return {
            ...userData,
        } as User;
    }

    async findUserById(id: string) {
        const user = await this.userModel.findById(id);
        return user;
    }

    async findUserByEmailAndProvider(email: string, provider: string) {
        const user = await this.userModel.findOne({ email: email, provider: provider });
        return user;
    }

    async saveUser(userData: User) {
        await this.userModel.create(userData);
    }

    async updateAccessToken(user: User, accessToken: string) {
        await this.userModel.findByIdAndUpdate(user.id, { access_token: accessToken });
    }
}
