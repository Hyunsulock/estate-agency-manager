import { Module } from '@nestjs/common';
import { HousePropertiesService } from './house-properties.service';
import { HousePropertiesController } from './house-properties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseProperty } from './entities/house-property.entity';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Agency } from 'src/agencies/entities/agency.entity';
import { User } from 'src/users/entities/user.entity';
import { HousePropertyUserSaved } from './entities/house-property-user-saved.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { UpdatesModule } from 'src/updates/updates.module';
import { Offer } from 'src/offers/entities/offer.entity';
import { UserHistoriesService } from 'src/user-histories/user-histories.service';
import { UserHistory } from 'src/user-histories/entities/user-history.entity';

@Module({
    imports:[
      UpdatesModule,
      TypeOrmModule.forFeature([
          HouseProperty,
          Apartment,
          Agency,
          User,
          HousePropertyUserSaved,
          Customer,
          Offer,
          UserHistory
      ])
    ],
  controllers: [HousePropertiesController],
  providers: [HousePropertiesService, UserHistoriesService],
})
export class HousePropertiesModule {}
