import { Body, Controller, Delete, Param, Post, UseGuards } from "@nestjs/common";
import { Types } from "mongoose";
import { JwtGuard } from "src/auth/auth.guard";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { User } from "src/schema/user.schema";
import { SubscriptionDTO } from "./dto/subscription.dto";
import { NotificationService } from "./notification.service";

// get, create, update, delete
@Controller("notification")
@UseGuards(JwtGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    createSubscriptionToDB(
        @CurrentUser() user: User,
        @Body("notification") subscription: SubscriptionDTO,
    ) {
        return this.notificationService.createSubscription(user.id, subscription);
    }

    @Delete()
    deleteSubscriptionFromDB(@CurrentUser() user: User) {
        return this.notificationService.deleteSubscription(user.id);
    }

    @Post(":roomId")
    createPushNotification(@Param("roomId") roomId: Types.ObjectId) {
        return this.notificationService.createPushNotification(roomId);
    }
}
