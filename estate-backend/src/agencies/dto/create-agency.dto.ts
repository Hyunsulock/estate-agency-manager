import { IsString } from "class-validator";

export class CreateAgencyDto {
    @IsString()
    name: string;

    @IsString()
    location: string;

    @IsString()
    phoneNumber: string;

}
