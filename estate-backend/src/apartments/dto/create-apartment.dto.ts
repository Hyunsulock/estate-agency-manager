import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateApartmentDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    address?: string;

    @IsOptional()
    @IsNumber()
    buildingYear?: number;

    @IsOptional()
    @IsNumber()
    parking?: number;

}
