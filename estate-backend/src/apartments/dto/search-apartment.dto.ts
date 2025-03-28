import { IsOptional, IsString } from "class-validator";

export class SearchApartmentDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    address?: string;
}