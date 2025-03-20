import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { HousePropertiesService } from './house-properties.service';
import { CreateHousePropertyDto } from './dto/create-house-property.dto';
import { UpdateHousePropertyDto } from './dto/update-house-property.dto';
import { UserId } from 'src/users/decorator/user-id.decorator';
import { AgencyId } from 'src/agencies/decorator/agency-id.decorator';
import { CreateHousePropertyWithOfferDto } from './dto/create-house-with-offer.dto';

@Controller('house-properties')
export class HousePropertiesController {
  constructor(private readonly housePropertiesService: HousePropertiesService) { }

  @Post()
  create(@Body() createHousePropertyDto: CreateHousePropertyDto, @AgencyId() agencyId: number) {
    console.log('create called')
    return this.housePropertiesService.create(createHousePropertyDto, agencyId);
  }

  @Post("create-with-offer")
  createWithOffer(@Body() createHousePropertyWithOfferDto: CreateHousePropertyWithOfferDto, @AgencyId() agencyId: number) {
    console.log('createOffer called')
    return this.housePropertiesService.createWithOffer(createHousePropertyWithOfferDto, agencyId);
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
    console.log(status)
    console.log(apartmentId)
    console.log(tradeType)
    console.log('minDeposit', minDeposit)
    console.log('maxDeposit', maxDeposit)
    console.log('minRent', minRent)
    console.log('maxRent', maxRent)
    console.log('minSize', minSize)
    console.log('maxSize', maxSize)
    console.log('offerCount', offerCount)
    console.log('buildingNumber', buildingNumber)
    console.log('unitNumber', unitNumber)
    return this.housePropertiesService.findByQuery(userId, agencyId, tradeType, status, apartmentId, minDeposit, maxDeposit, minRent, maxRent, minSize, maxSize, offerCount, buildingNumber, unitNumber)
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
