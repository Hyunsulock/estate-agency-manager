import { Module } from '@nestjs/common';
import { UserHistoriesService } from './user-histories.service';
import { UserHistoriesController } from './user-histories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHistory } from './entities/user-history.entity';
import { User } from 'src/users/entities/user.entity';
import { Agency } from 'src/agencies/entities/agency.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([
      UserHistory,
      User,
      Agency
    ])
  ],
  controllers: [UserHistoriesController],
  providers: [UserHistoriesService],
  exports: [UserHistoriesService]
})
export class UserHistoriesModule { }
