import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseProperty } from 'src/house-properties/entities/house-property.entity';
import { Agency } from 'src/agencies/entities/agency.entity';
import { UpdatesModule } from 'src/updates/updates.module';

@Module({
  imports: [
    UpdatesModule,
    TypeOrmModule.forFeature(
      [
        Offer,
        HouseProperty,
        Agency,
      ]
    ),
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule { }
