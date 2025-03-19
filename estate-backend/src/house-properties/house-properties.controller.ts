import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { HousePropertiesService } from './house-properties.service';
import { CreateHousePropertyDto } from './dto/create-house-property.dto';
import { UpdateHousePropertyDto } from './dto/update-house-property.dto';
import { UserId } from 'src/users/decorator/user-id.decorator';
import { AgencyId } from 'src/agencies/decorator/agency-id.decorator';

@Controller('house-properties')
export class HousePropertiesController {
  constructor(private readonly housePropertiesService: HousePropertiesService) { }

  @Post()
  create(@Body() createHousePropertyDto: CreateHousePropertyDto, @AgencyId() agencyId: number) {
    return this.housePropertiesService.create(createHousePropertyDto, agencyId);
  }

  @Get('search')
  findByQuery(
    @UserId() userId: number,
    @AgencyId() agencyId: number,
    @Query('tradeType') tradeType?: string,
    @Query('status') status?: string,
    @Query('apartmentId') apartmentId?: number,
    @Query('minDeposit') minDeposit?: string,
    @Query('maxDeposit') maxDeposit?: string,
    @Query('minRent') minRent?: string,
    @Query('maxRent') maxRent?: string,
    @Query('minSize') minSize?: string,
    @Query('maxSize') maxSize?: string,
    @Query('buildingNumber') buildingNumber?: string,
    @Query('unitNumber') unitNumber?: string,
  ) {
    console.log(status)
    console.log(apartmentId)
    return this.housePropertiesService.findByQuery(userId, agencyId, tradeType, status, apartmentId)
  }

  @Get()
  findAll() {
    return this.housePropertiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.housePropertiesService.findOne(+id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHousePropertyDto: UpdateHousePropertyDto) {
    return this.housePropertiesService.update(+id, updateHousePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.housePropertiesService.remove(+id);
  }

  @Post(':id/save')
  createHousePropertySaved(
    @Param('id', ParseIntPipe) housePropertyId: number,
    @UserId() userId: number,

  ) {
    return this.housePropertiesService.toggleHousePropertySaved(housePropertyId, userId);
  }



}
