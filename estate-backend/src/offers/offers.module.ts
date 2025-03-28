import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseProperty } from 'src/house-properties/entities/house-property.entity';
import { Agency } from 'src/agencies/entities/agency.entity';
import { UpdatesModule } from 'src/updates/updates.module';
import { UserHistory } from 'src/user-histories/entities/user-history.entity';
import { UserHistoriesService } from 'src/user-histories/user-histories.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    UpdatesModule,
    TypeOrmModule.forFeature(
      [
        Offer,
        HouseProperty,
        Agency,
        UserHistory,
        User
      ]
    ),
  ],
  controllers: [OffersController],
  providers: [OffersService, UserHistoriesService],
})
export class OffersModule { }
