import { HouseProperty } from './../../house-properties/entities/house-property.entity';
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDealDto {
    @IsOptional()
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

    @ArrayNotEmpty()
    @IsString({
        each: true,
    })
    @Type(() => String)
    dealersId: string[];

    @IsNumber()
    buyerId: number;
    
    @IsNumber()
    sellerId: number;

}
