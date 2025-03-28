import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { AgencyId } from 'src/agencies/decorator/agency-id.decorator';
import { SearchApartmentDto } from './dto/search-apartment.dto';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) { }

  @Post()
  create(@Body() createApartmentDto: CreateApartmentDto, @AgencyId() agencyId: number) {
    console.log('hi')
    return this.apartmentsService.create(createApartmentDto, agencyId);
  }

  @Get('all')
  findAll(@Request() req: any) {
    console.log(req.user)
    return this.apartmentsService.findAll();
  }

  @Get()
  find(@AgencyId() agencyId: number) {
    return this.apartmentsService.find(agencyId);
  }

  @Get('search')
  search(@Query() searchDto: SearchApartmentDto, @AgencyId() agencyId: number) {
    return this.apartmentsService.search(searchDto, agencyId);
  }


  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apartmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApartmentDto: UpdateApartmentDto) {
    return this.apartmentsService.update(+id, updateApartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apartmentsService.remove(+id);
  }
}
