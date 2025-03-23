import { Module } from '@nestjs/common';
import { UpdatesService } from './updates.service';
import { UpdatesGateway } from './updates.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from 'src/agencies/entities/agency.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature(
      [
        User, Agency
      ]
    ),
  ],
  providers: [UpdatesGateway, UpdatesService],
  exports: [UpdatesGateway],
})
export class UpdatesModule { }
