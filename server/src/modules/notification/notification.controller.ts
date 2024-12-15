import { Body, Controller, Delete, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { JwtGuard } from "src/common/guards/auth.guard";
import { User } from "src/modules/users/schemas/user.schema";
import { SubscriptionDTO } from "./dto/subscription.dto";
import { NotificationService } from "./notification.service";

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

    @Post("/push")
    createPushNotification(@Body("userIds") userIds: string[]) {
        return this.notificationService.createPushNotification(userIds);
    }
}
