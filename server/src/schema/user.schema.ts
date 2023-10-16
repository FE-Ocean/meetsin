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
    password: string;

    @Prop({
        required: true,
    })
    user_name: string;

    @Prop()
    character: string;

    @Prop()
    profile_img: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
