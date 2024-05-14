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

    async findUserById(_id: Types.ObjectId) {
        const user = await this.userModel.findOne({ _id });
        return user;
    }

    async saveUser(userData: UserEntity) {
        await this.userModel.create(userData);
    }

    async updateAccessToken(user: UserEntity, accessToken: string) {
        await this.userModel.updateOne({ _id: user._id }, { access_token: accessToken });
    }
}
