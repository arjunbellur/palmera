import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { ListingsModule } from './listings/listings.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { EmailModule } from './email/email.module';
import { FilesModule } from './files/files.module';
import { RealtimeModule } from './realtime/realtime.module';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    GroupsModule,
    ListingsModule,
    BookingsModule,
    PaymentsModule,
    ReviewsModule,
    EmailModule,
    FilesModule,
    RealtimeModule,
    MonitoringModule,
  ],
})
export class AppModule {}
