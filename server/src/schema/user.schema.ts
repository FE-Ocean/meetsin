import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

const options: SchemaOptions = {
    timestamps: true,
    collection: "Users",
};

@Schema(options)
export class User {
    @Prop({
        required: true,
        unique: true,
    })
    user_id: string;

    @Prop({
        required: true,
    })
    user_name: string;

    @Prop({
        required: true,
    })
    email: string;

    @Prop()
    character?: string;

    @Prop()
    profile_img: string;

    @Prop()
    accessToken: string;

    @Prop()
    refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
