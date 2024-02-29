import { Request } from "express";
import { User } from "src/schema/user.schema";

export type LoginRequest = Request & {
    user: User
}