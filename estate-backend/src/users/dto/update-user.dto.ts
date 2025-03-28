import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsNumber()
    agency?: number

    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    email?: string
}
