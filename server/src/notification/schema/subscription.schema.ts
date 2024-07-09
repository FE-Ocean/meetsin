import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
class Keys {
    @Prop({ required: true })
    p256dh: string;

    @Prop({ required: true })
    auth: string;
}

@Schema()
export class Subscription {
    @Prop({ required: true })
    endpoint: string;

    @Prop({ required: true })
    keys: Keys;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
