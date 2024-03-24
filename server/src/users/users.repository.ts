import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserEntity } from "src/schema/user.schema";

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>) {}

    createUser(userData: UserEntity) {
        return {
            ...userData,
        } as UserEntity
    }

    async findUserById(user_id: string) {
        const user = await this.userModel.findOne({ user_id });
        return user;
    }

    async saveUser(userData: UserEntity) {
        await this.userModel.create(userData);
    }
    
    async updateAccessToken(user: UserEntity, accessToken: string) {
        await this.userModel.updateOne({user_id: user.user_id}, {access_token: accessToken})
    }
}