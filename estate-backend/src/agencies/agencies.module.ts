import { Module } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { AgenciesController } from './agencies.controller';
import { Agency } from './entities/agency.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHistoriesService } from 'src/user-histories/user-histories.service';
import { User } from 'src/users/entities/user.entity';
import { UserHistory } from 'src/user-histories/entities/user-history.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agency,
      User,
      UserHistory
    ])
  ],
  controllers: [AgenciesController],
  providers: [AgenciesService, UserHistoriesService],
})
export class AgenciesModule { }
