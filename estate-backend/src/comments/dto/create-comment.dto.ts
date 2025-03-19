import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {

    @IsOptional()
    @IsNumber()
    offerId?: number;

    @IsOptional()
    @IsNumber()
    housePropertyId?: number;

    @IsOptional()
    @IsNumber()
    customerId?: number;

    @IsOptional()
    @IsNumber()
    dealId?: number;

    @IsString()
    comment: string;
}
