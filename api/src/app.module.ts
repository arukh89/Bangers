import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { LeaderboardService } from './leaderboard/leaderboard.service';
import { LeaderboardController } from './leaderboard/leaderboard.controller';
import { MemberService } from './member/member.service';
import { MemberController } from './member/member.controller';
import { LikeService } from './like/like.service';
import { LikeController } from './like/like.controller';
@Module({
  imports: [],
  controllers: [LeaderboardController, MemberController, LikeController],
  providers: [PrismaService, LeaderboardService, MemberService, LikeService],
})
export class AppModule {}
