import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { RBAC } from "../decorator/rbac.decorator";
import { Role } from "src/users/entities/user.entity";

@Injectable()
export class RBACGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) {}
    canActivate(context: ExecutionContext): boolean {
        const role = this.reflector.get<Role>(RBAC, context.getHandler());
        if (!Object.values(Role).includes(role)) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        // if (!user) {
        //     return false;
        // }
        // return user.role <= role;

        if (!user) {
            throw new UnauthorizedException(); // Will return 401
        }

        if (user.role > role) {
            throw new ForbiddenException(); // Will return 403
        }
        return true;
    }
}