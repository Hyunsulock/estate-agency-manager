import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { SearchAgencyDto } from './dto/search-agency.dto';

@Controller('agencies')
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) { }

  @Post()
  create(@Body() createAgencyDto: CreateAgencyDto) {
    console.log('createAgencyDto', createAgencyDto)
    return this.agenciesService.create(createAgencyDto);
  }

  @Get()
  findAll() {
    return this.agenciesService.findAll();
  }

  @Get('search')
  async searchAgencies(@Query() searchAgencyDto: SearchAgencyDto) {
    console.log('hi')
    return this.agenciesService.searchAgencies(searchAgencyDto);

  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.agenciesService.findOne(+id);
  }




  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgencyDto: UpdateAgencyDto) {
    return this.agenciesService.update(+id, updateAgencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agenciesService.remove(+id);
  }
}
