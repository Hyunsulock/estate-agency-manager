import { PartialType } from '@nestjs/mapped-types';
import { CreateHousePropertyDto } from './create-house-property.dto';

export class UpdateHousePropertyDto extends PartialType(CreateHousePropertyDto) {}
