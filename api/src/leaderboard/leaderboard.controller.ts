import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private service: LeaderboardService) {}
  @Get()
  async list() {
    return this.service.getTop5();
  }
}
