import { Module } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { ApartmentsController } from './apartments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { UpdatesModule } from 'src/updates/updates.module';
import { Agency } from 'src/agencies/entities/agency.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Apartment,
        Agency
      ]
    ),

    UpdatesModule
  ],
  controllers: [ApartmentsController],
  providers: [ApartmentsService],
})
export class ApartmentsModule {}
