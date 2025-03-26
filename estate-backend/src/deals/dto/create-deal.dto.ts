import { HouseProperty } from './../../house-properties/entities/house-property.entity';
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDealDto {
    @IsNumber()
    offerId: number;

    @IsNumber()
    housePropertyId: number;

    @IsNumber()
    buyAgencyId: number;

    @IsNumber()
    sellAgencyId: number;

    @IsDate()
    dealDate: Date;

    @IsString()
    dealerId: string;

    @IsOptional()
    @IsNumber()
    buyerId: number;
    
    @IsOptional()
    @IsNumber()
    sellerId: number;

}
