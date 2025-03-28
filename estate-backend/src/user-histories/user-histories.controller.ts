import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserHistoriesService } from './user-histories.service';
import { CreateUserHistoryDto } from './dto/create-user-history.dto';
import { UpdateUserHistoryDto } from './dto/update-user-history.dto';
import { AgencyId } from 'src/agencies/decorator/agency-id.decorator';
import { SearchUserHistoriesDto } from './dto/search-user-history.dto';
import { UserId } from 'src/users/decorator/user-id.decorator';

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

  @Get('activity')
  userActicity(@UserId() userId: number) {
    return this.userHistoriesService.userActivityInLast30Days(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userHistoriesService.findOne(+id);
  }




  // @Get('activity')
  // userActicity(@UserId() userId: number) {
  //   return this.userHistoriesService.userActivityInLast30Days(userId);
  // }

  @Delete(':id')
  remove(@Param('id') id: string, @AgencyId() agencyId: number) {
    return this.userHistoriesService.remove(+id);
  }
}
