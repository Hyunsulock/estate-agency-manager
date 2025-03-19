import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { User } from 'src/users/entities/user.entity';
import { Agency } from 'src/agencies/entities/agency.entity';
import { HouseProperty } from 'src/house-properties/entities/house-property.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Deal } from 'src/deals/entities/deal.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        Comment,
        Customer,
        User,
        Agency,
        HouseProperty,
        Offer,
        Deal

      ],)],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
