import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vkm, VkmSchema } from '../models/vkm.schema';
import { VkmService } from '../services/vkm.service';
import { VkmController } from '../controllers/vkm.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Vkm.name, schema: VkmSchema }])],
  providers: [VkmService],
  controllers: [VkmController],
})
export class VkmModule {}
