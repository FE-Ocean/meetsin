import { Body, Controller, Delete, Post, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/auth.guard";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { User } from "src/schema/user.schema";
import { NotificationDTO } from "./dto/notification.dto";
import { NotificationService } from "./notification.service";

// get, create, update, delete
@Controller("notification")
@UseGuards(JwtGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    createSubscriptionToDB(
        @CurrentUser() user: User,
        @Body("notification") subscription: NotificationDTO,
    ) {
        return this.notificationService.createSubscription(user.id, subscription);
    }

    @Delete()
    deleteSubscriptionFromDB(@CurrentUser() user: User) {
        return this.notificationService.deleteSubscription(user.id);
    }

    @Post("/send")
    createPushNotification(@Body("subscriptions") subscriptions: NotificationDTO[]) {
        return this.notificationService.createPushNotification(subscriptions);
    }
}
