import { Body, Controller, Delete, Post, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/auth.guard";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { UserEntity } from "src/schema/user.schema";
import { NotificationService } from "./notification.service";
import { Notification } from "./schema/notificationn.schema";

// get, create, update, delete
@Controller("notification")
@UseGuards(JwtGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    createSubscriptionToDB(
        @CurrentUser() user: UserEntity,
        @Body("subscription") subscription: Notification,
    ) {
        return this.notificationService.createSubscription(user.id, subscription);
    }

    @Delete()
    deleteSubscriptionFromDB(@CurrentUser() user: UserEntity) {
        return this.notificationService.deleteSubscription(user.id);
    }
}
