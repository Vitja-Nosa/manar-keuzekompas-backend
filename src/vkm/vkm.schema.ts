
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'vkm_modules' })
export class Vkm extends Document {
  @Prop() name: string;
  @Prop() shortdescription?: string;
  @Prop() description?: string;
  @Prop() content?: string;
  @Prop() studycredit?: number;
  @Prop() location?: string;
  @Prop() contact_id?: string;
  @Prop() level?: string;
  @Prop() learningoutcomes?: string;
}
export const VkmSchema = SchemaFactory.createForClass(Vkm);
