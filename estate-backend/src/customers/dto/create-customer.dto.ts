import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {

    @IsString()
    name: string;

    @IsString()
    phoneNumber: string;

    @IsOptional()
    @IsNumber()
    housePropertyId: number;

}
