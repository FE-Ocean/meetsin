import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserEntity } from "src/schema/user.schema";

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>) {}

    createUser(userData: UserEntity) {
        return {
            ...userData,
        } as UserEntity;
    }

    async findUserById(id: Types.ObjectId) {
        const user = await this.userModel.findById(id);
        return user;
    }

    async findUserByEmailAndProvider(email: string, provider: string) {
        const user = await this.userModel.findOne({email: email, provider: provider});
        return user
    }

    async saveUser(userData: UserEntity) {
        await this.userModel.create(userData);
    }

    async updateAccessToken(user: UserEntity, accessToken: string) {
        await this.userModel.findByIdAndUpdate(user.id, { access_token: accessToken });
    }
}
