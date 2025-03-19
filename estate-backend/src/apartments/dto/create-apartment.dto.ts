import { IsNotEmpty, IsString } from "class-validator";

export class CreateApartmentDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    
}
