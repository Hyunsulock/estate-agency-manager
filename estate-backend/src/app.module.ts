import { Comment } from './comments/entities/comment.entity';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgenciesModule } from './agencies/agencies.module';
import { ApartmentsModule } from './apartments/apartments.module';
import { CustomersModule } from './customers/customers.module';
import { OffersModule } from './offers/offers.module';
import { DealsModule } from './deals/deals.module';
import { CommentsModule } from './comments/comments.module';
import { HousePropertiesModule } from './house-properties/house-properties.module';
import { UserHistoriesModule } from './user-histories/user-histories.module';
import { Apartment } from './apartments/entities/apartment.entity';
import { Agency } from './agencies/entities/agency.entity';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { BearerTokenMiddleware } from './auth/middleware/bearer.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { RBACGuard } from './auth/guard/rbac.guard';
import { Offer } from './offers/entities/offer.entity';
import { Deal } from './deals/entities/deal.entity';
import { HouseProperty } from './house-properties/entities/house-property.entity';
import { Customer } from './customers/entities/customer.entity';
import { HousePropertyUserSaved } from './house-properties/entities/house-property-user-saved.entity';
import { UpdatesModule } from './updates/updates.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/entities/notification.entity';
import { UserHistory } from './user-histories/entities/user-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ENV: Joi.string().valid('test', 'dev', 'prod').required(),
        DB_TYPE: Joi.string().valid('postgres').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        HASH_ROUNDS: Joi.number().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>("DB_TYPE") as "postgres",
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_DATABASE"),
        entities: [
          User,
          Apartment,
          Agency,
          Offer,
          Deal,
          HouseProperty,
          Customer,
          Comment,
          HousePropertyUserSaved,
          Notification,
          UserHistory,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AgenciesModule,
    ApartmentsModule,
    CustomersModule,
    OffersModule,
    DealsModule,
    CommentsModule,
    HousePropertiesModule,
    UserHistoriesModule,
    AuthModule,
    UpdatesModule,
    NotificationsModule,

  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RBACGuard,
    },
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      BearerTokenMiddleware,
    ).exclude({
      path: 'auth/login',
      method: RequestMethod.POST,
    }, {
      path: 'auth/register',
      method: RequestMethod.POST,
    }).forRoutes('*')
  }

}
