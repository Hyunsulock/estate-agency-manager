import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateHousePropertyDto {
    @IsNumber()
    room: number;

    @IsNumber()
    size: number;

    @IsNumber()
    buildingNumber: number;

    @IsString()
    floor: string;

    @IsOptional()
    @IsNumber()
    unitNumber?: number;

    @IsNumber()
    apartmentId: number

    @IsOptional()
    @IsNumber()
    ownerId?: number;

    @IsOptional()
    @IsString()
    status?: string

}
