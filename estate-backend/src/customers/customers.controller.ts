import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AgencyId } from 'src/agencies/decorator/agency-id.decorator';
import { SearchCustomerDto } from './dto/search-customer.dto';
import { SearchAgencyDto } from 'src/agencies/dto/search-agency.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto, @AgencyId() agencyId: number) {
    return this.customersService.create(createCustomerDto, agencyId);
  }

  @Get('search')
  findAll(@Query() searchCustomerDto: SearchCustomerDto, @AgencyId() agencyId: number) {
    return this.customersService.findByAgencyQuery(agencyId, searchCustomerDto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
