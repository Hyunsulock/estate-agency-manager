
import { IsOptional, IsString } from 'class-validator';

export class SearchAgencyDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    location?: string;
}
