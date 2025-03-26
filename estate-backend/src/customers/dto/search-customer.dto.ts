
import { IsOptional, IsString } from 'class-validator';

export class SearchCustomerDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    intro?: string;
}
