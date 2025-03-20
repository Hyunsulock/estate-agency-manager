import { CreateOfferDto } from "src/offers/dto/create-offer.dto";
import { CreateHousePropertyDto } from "./create-house-property.dto";
import { IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateHousePropertyWithOfferDto {
    @IsObject()
    @ValidateNested()
    @Type(() => CreateHousePropertyDto)
    houseProperty: CreateHousePropertyDto;
    @IsObject()
    @ValidateNested()
    @Type(() => CreateOfferDto)
    offer: CreateOfferDto;
}