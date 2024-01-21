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
    })
    user_id: string;

    @Prop({
        required: true,
    })
    user_name: string;

    @Prop()
    character?: string;

    @Prop()
    profile_img: string;

    @Prop()
    access_token: string;

    @Prop()
    refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);