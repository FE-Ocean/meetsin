import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Injectable()

export class GoogleAuthGuard extends AuthGuard("google") {
    constructor() {
        super();
    }
    
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest() as Request;
        console.log(request.isAuthenticated())
        await super.logIn(request);
        return result;
    }
}

export class KakaoAuthGuard extends AuthGuard("kakao") {
    constructor() {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return result;
    }
}