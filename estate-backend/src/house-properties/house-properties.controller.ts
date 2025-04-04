import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { HousePropertiesService } from './house-properties.service';
import { CreateHousePropertyDto } from './dto/create-house-property.dto';
import { UpdateHousePropertyDto } from './dto/update-house-property.dto';
import { UserId } from 'src/users/decorator/user-id.decorator';
import { AgencyId } from 'src/agencies/decorator/agency-id.decorator';
import { CreateHousePropertyWithOfferDto } from './dto/create-house-with-offer.dto';
import { RBAC } from 'src/auth/decorator/rbac.decorator';
import { Role } from 'src/users/entities/user.entity';

@Controller('house-properties')
export class HousePropertiesController {
  constructor(private readonly housePropertiesService: HousePropertiesService) { }

  @Post()
  create(@Body() createHousePropertyDto: CreateHousePropertyDto, @AgencyId() agencyId: number) {
    console.log('create called')
    return this.housePropertiesService.create(createHousePropertyDto, agencyId);
  }

  @Post("create-with-offer")
  createWithOffer(@Body() createHousePropertyWithOfferDto: CreateHousePropertyWithOfferDto, @AgencyId() agencyId: number, @UserId() userId: number,) {
    console.log('createOffer called')
    return this.housePropertiesService.createWithOffer(createHousePropertyWithOfferDto, agencyId, userId);
  }

  @Get('search')
  findByQuery(
    @UserId() userId: number,
    @AgencyId() agencyId: number,
    @Query('tradeType') tradeType?: string,
    @Query('status') status?: string,
    @Query('apartmentId') apartmentId?: number,
    @Query('minDeposit') minDeposit?: number,
    @Query('maxDeposit') maxDeposit?: number,
    @Query('minRent') minRent?: number,
    @Query('maxRent') maxRent?: number,
    @Query('minSize') minSize?: number,
    @Query('maxSize') maxSize?: number,
    @Query('offerCount') offerCount?: number,
    @Query('buildingNumber') buildingNumber?: number,
    @Query('unitNumber') unitNumber?: number,
  ) {
    return this.housePropertiesService.findByQuery(userId, agencyId, tradeType, status, apartmentId, minDeposit, maxDeposit, minRent, maxRent, minSize, maxSize, offerCount, buildingNumber, unitNumber)
  }

  @Get()
  findAll() {
    return this.housePropertiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AgencyId() agencyId: number) {
    return this.housePropertiesService.findOne(+id, agencyId);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHousePropertyDto: UpdateHousePropertyDto, @UserId() userId: number, @AgencyId() agencyId: number,) {
    return this.housePropertiesService.update(+id, updateHousePropertyDto, userId, agencyId);
  }

  // @RBAC(Role.manager)
  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: number, @AgencyId() agencyId: number,) {
    return this.housePropertiesService.remove(+id, userId, agencyId);
  }

  @Post(':id/save')
  createHousePropertySaved(
    @Param('id', ParseIntPipe) housePropertyId: number,
    @UserId() userId: number,

  ) {
    return this.housePropertiesService.toggleHousePropertySaved(housePropertyId, userId);
  }



}
