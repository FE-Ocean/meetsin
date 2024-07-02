import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserEntity } from "src/schema/user.schema";
import { NotificationDTO } from "./dto/notification.dto";

@Injectable()
export class NotificationService {
    constructor(@InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>) {}

    createSubscription(userId: Types.ObjectId, subscription: NotificationDTO) {
        // 구독한 사용자의 유저 스키마에 구독 객체 저장(notification 필드에)
        const user = this.userModel.updateOne(
            { _id: userId },
            { $addToSet: { notification: subscription } },
        );
        return user;
    }

    async deleteSubscription(userId: Types.ObjectId) {
        // 구독 해제한 사용자의 유저 스키마에 notification 필드 제거
        const deletedSubscriptionObject = await this.userModel.updateOne(
            { _id: userId },
            { $unset: { notification: "" } },
        );

        if (!deletedSubscriptionObject) {
            throw new Error("구독 객체가 제거되지 않았습니다.");
            // 이 deletedSubscriptionObject 뭐가 찍히는지 봐야겠다~
        }

        return deletedSubscriptionObject;
    }
}
