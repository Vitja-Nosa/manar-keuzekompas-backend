import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { VkmService } from './vkm.service';

class CreateVkmDto {
  @IsString() code: string;
  @IsString() name: string;
  @IsNumber() ec: number;
  @IsEnum(['NLQF-5', 'NLQF-6'] as any) level: 'NLQF-5' | 'NLQF-6';
  @IsOptional() @IsString() description?: string;
} 

@Controller('vkm')
export class VkmController {
  constructor(private readonly service: VkmService) {}

  @Get()
  list(
    @Query('query') query?: string,
    @Query('ec') ec?: string,
    @Query('level') level?: string,
    @Query('name') name?: string,
  ) {
    return this.service.findAll({
      query,
      ec: ec ? Number(ec) : undefined,
      level,
      name,
    });
  }

  @Get(':id')
  byId(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() dto: CreateVkmDto) {
    return this.service.create(dto as any);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateVkmDto>) {
    return this.service.update(id, dto as any);
  }
}