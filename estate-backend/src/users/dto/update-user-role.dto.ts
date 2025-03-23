import { IsNumber } from "class-validator"

export class UpdateUserRoleDto  {
    @IsNumber()
    role?: number
}
