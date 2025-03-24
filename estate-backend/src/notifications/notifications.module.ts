import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { Agency } from 'src/agencies/entities/agency.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdatesModule } from 'src/updates/updates.module';

@Module({
  imports: [
    UpdatesModule,
    TypeOrmModule.forFeature([
      Notification,
      Agency,
      User,

    ])
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule { }
