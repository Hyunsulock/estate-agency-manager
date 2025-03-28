import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class SearchUserHistoriesDto {

    @IsOptional()
    @IsString()
    tableName?: string;

    @IsOptional()
    @IsNumber()
    userId?: number;

    @IsOptional()
    @IsString()
    action?: string;

    @IsOptional()
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsDateString()
    userHistoryDateStartRange?: string;

    @IsOptional()
    @IsDateString()
    userHistoryDateEndRange?: string;
}
