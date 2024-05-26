import { OmitType } from "@nestjs/mapped-types";
import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Types } from "mongoose";

const options: SchemaOptions = {
    timestamps: true,
    collection: "Users",
    versionKey: false,
};

// DB에 저장되는 유저 정보 (토큰 포함)
@Schema(options)
export class UserEntity {
    _id?: Types.ObjectId;

    @Prop({
        required: true,
    })
    user_name: string;

    @Prop()
    email: string;

    @Prop()
    character?: string;

    @Prop()
    profile_img: string;

    @Prop({
        required: true,
    })
    access_token: string;

    @Prop()
    refresh_token: string;
}

// 클라이언트에 제공되는 유저 정보 (토큰 미포함)
export class UserDto extends OmitType(UserEntity, ["access_token", "refresh_token"]) {}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
