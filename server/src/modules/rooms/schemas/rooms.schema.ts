import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "src/modules/users/schemas/user.schema";

const options = {
    collection: "Rooms",
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: false },
};

@Schema(options)
export class Room {
    @Prop({ required: true })
    room_name: string;

    @Prop({ required: true })
    admin: string;

    @Prop({ required: true })
    userIds: User[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
