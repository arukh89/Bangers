import { Controller, Get, Post, Body } from '@nestjs/common';
import { MemberService } from './member.service';
@Controller('members')
export class MemberController {
  constructor(private service: MemberService) {}
  @Get()
  async list() {
    return this.service.list();
  }
  @Post()
  async ingest(@Body() body: any[]) {
    await this.service.upsertBatch(body);
    return { ok: true };
  }
}
