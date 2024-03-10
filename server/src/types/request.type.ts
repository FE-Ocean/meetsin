import { Request } from "express";
import { UserEntity } from "src/schema/user.schema";

export type LoginRequest = Request & {
    user: UserEntity
}