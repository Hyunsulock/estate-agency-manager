import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateApartmentDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsNumber()
    bulidingYear?: string;

    @IsOptional()
    @IsNumber()
    parking?: string;

}
