import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseProperty } from 'src/house-properties/entities/house-property.entity';
import { Agency } from 'src/agencies/entities/agency.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Agency,
      HouseProperty,
      
    ],)],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule { }
