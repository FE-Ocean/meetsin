import { Module, forwardRef } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/modules/users/schemas/user.schema";
import { UsersRepository } from "./users.repository";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        forwardRef(() => AuthModule),
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersRepository],
})
export class UsersModule {}
