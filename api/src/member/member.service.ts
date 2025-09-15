import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}
  async upsertBatch(users: { fid: number; username: string; displayName: string; pfp?: string }[]) {
    for (const u of users) {
      await this.prisma.member.upsert({
        where: { fid: u.fid },
        update: u,
        create: u,
      });
    }
  }
  async list() {
    return this.prisma.member.findMany({ orderBy: { username: 'asc' } });
  }
}
