import { Module } from '@nestjs/common';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { Deal } from './entities/deal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from 'src/agencies/entities/agency.entity';
import { HouseProperty } from 'src/house-properties/entities/house-property.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { UpdatesModule } from 'src/updates/updates.module';

@Module({
  imports:[
    UpdatesModule,
        TypeOrmModule.forFeature([
            Deal,
            Agency,
            Offer,
            HouseProperty,
            User,
            Customer
        ])
      ],
  controllers: [DealsController],
  providers: [DealsService],
})
export class DealsModule {}
