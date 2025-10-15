import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vkm, VkmSchema } from './vkm.schema';
import { VkmService } from './vkm.service';
import { VkmController } from './vkm.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Vkm.name, schema: VkmSchema }])],
  providers: [VkmService],
  controllers: [VkmController],
})
export class VkmModule {}
