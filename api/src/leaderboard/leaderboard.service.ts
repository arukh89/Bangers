import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}
  async getTop5() {
    return this.prisma.leader.findMany({ orderBy: { score: 'desc' }, take: 5 });
  }
}

