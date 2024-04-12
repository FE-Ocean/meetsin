import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ collection: "Rooms", versionKey: false })
export class Room {
    @Prop({ required: true })
    room_name: string;

    @Prop()
    admin: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
