import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PrismaService } from '../prisma/prisma.service';
import { BullModule } from '@nestjs/bull';
import { OrdersProcessor } from './orders/orders.processor';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [AuthModule,
    PrismaModule,
    SubscriptionsModule,
    OrdersModule,
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: 'localhost',
          port: 6380,
        },
      })

    }),
    BullModule.registerQueue({
      name: 'orders',
    }),],
})
export class AppModule { }
