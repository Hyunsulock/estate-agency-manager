import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { UserId } from 'src/users/decorator/user-id.decorator';
import { SearchDealDto } from './dto/search-deal.dto';
import { AgencyId } from 'src/agencies/decorator/agency-id.decorator';

@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  create(@Body() createDealDto: CreateDealDto, @UserId() userId : number, @AgencyId() agencyId: number) {
    return this.dealsService.create(createDealDto, userId, agencyId);
  }

  @Get()
  findAll() {
    return this.dealsService.findAll();
  }

  @Get('search')
  searchByAgency(@AgencyId() agencyId: number,  @Query() searchDealDto: SearchDealDto) {
    return this.dealsService.searchDeals(searchDealDto, agencyId);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dealsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDealDto: UpdateDealDto, @UserId() userId: number,  @AgencyId() agencyId: number) {
    return this.dealsService.update(+id, updateDealDto, userId, agencyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: number, @AgencyId() agencyId: number) {
    return this.dealsService.remove(+id, userId, agencyId);
  }
}
