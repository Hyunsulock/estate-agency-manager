import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const AgencyId = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();

        return request?.user?.agency;
    }
);