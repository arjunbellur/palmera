import { Module } from '@nestjs/common';
import { RealtimeService } from './realtime.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RealtimeService],
  exports: [RealtimeService],
})
export class RealtimeModule {}
