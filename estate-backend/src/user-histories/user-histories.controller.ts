import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserHistoriesService } from './user-histories.service';
import { CreateUserHistoryDto } from './dto/create-user-history.dto';
import { UpdateUserHistoryDto } from './dto/update-user-history.dto';
import { AgencyId } from 'src/agencies/decorator/agency-id.decorator';
import { SearchUserHistoriesDto } from './dto/search-user-history.dto';

@Controller('user-histories')
export class UserHistoriesController {
  constructor(private readonly userHistoriesService: UserHistoriesService) {}


  @Get()
  findAll() {
    return this.userHistoriesService.findAll();
  }

  @Get('search')
  searchHistories(@Query() query: SearchUserHistoriesDto, @AgencyId() agencyId: number) {
    return this.userHistoriesService.searchHistories(query, agencyId);  
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userHistoriesService.findOne(+id);
  }


  @Get('activity/:id')
  userActicity(@Param('id') id: string) {
    return this.userHistoriesService.userActivityInLast30Days(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AgencyId() agencyId: number) {
    return this.userHistoriesService.remove(+id);
  }
}
