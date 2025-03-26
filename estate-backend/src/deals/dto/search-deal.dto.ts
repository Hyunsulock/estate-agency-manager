import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class SearchDealDto {

    @IsOptional()
    @IsString()
    tradeType?: string;

    @IsOptional()
    @IsString()
    apartmentId?: string;

    @IsOptional()
    @IsNumber()
    buildingNumber?: number;

    @IsOptional()
    @IsNumber()
    unitNumber?: number;

    @IsOptional()
    @IsString()
    buyerName?: string;

    @IsOptional()
    @IsString()
    sellerName?: string;

    @IsOptional()
    @IsString()
    sellerAgencyName?: string;

    @IsOptional()
    @IsString()
    buyerAgencyName?: string;

    @IsOptional()
    @IsDateString()
    dealDateStartRange?: string;

    @IsOptional()
    @IsDateString()
    dealDateEndRange?: string;
}
