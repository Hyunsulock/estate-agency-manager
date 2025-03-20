import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOfferDto {
    @IsOptional()
    @IsString()
    tradeType: string;

    @IsNotEmpty()
    @IsNumber()
    agencyId: number;

    @IsOptional()
    @IsNumber()
    housePropertyId: number;

    @IsString()
    keyFeatures: string;

    @IsString()
    status: string;

    @IsOptional()
    @IsNumber()
    jeonseDeposit?: number;

    @IsOptional()
    @IsNumber()
    rentDeposit?: number;

    @IsOptional()
    @IsNumber()
    rentPrice?: number;

    @IsOptional()
    @IsNumber()
    salePrice?: number;
}


