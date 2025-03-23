import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { UserId } from 'src/users/decorator/user-id.decorator';
import { AgencyId } from 'src/agencies/decorator/agency-id.decorator';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @AgencyId() agencyId: number, @UserId() userId: number) {
    return this.offersService.create(createOfferDto, agencyId, userId);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, ) {
    return this.offersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto, @UserId() userId: number) {
    return this.offersService.update(+id, updateOfferDto);
  }

  @Get('by-property/:housePropertyId/by-trade-type/:tradeType')
  findByHousePropertyId(@Param('housePropertyId') housePropertyId: number, @Param('tradeType') tradeType: string) {
    return this.offersService.findOffersByHousePropertyId(housePropertyId, tradeType);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: number, @AgencyId() agencyId: number) {
    return this.offersService.remove(+id, userId, agencyId);
  }
}
