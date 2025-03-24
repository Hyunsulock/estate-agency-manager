import {  IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {

    @IsOptional()
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    message?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}
