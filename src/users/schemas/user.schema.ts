import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['creator', 'sponsor'] })
  role: string;

  @Prop()
  bio: string;

  @Prop()
  location: string;

  @Prop({ type: [{ label: String, url: String }] })
  links: { label: string; url: string }[];

  // Creator specific fields
  @Prop()
  platform?: string;

  @Prop()
  handle?: string;

  @Prop()
  followers?: number;

  @Prop()
  dob?: Date;

  @Prop()
  audienceReach?: string;

  // Sponsor specific fields
  @Prop()
  companyName?: string;

  @Prop()
  noOfEmployees?: string;

  @Prop()
  budget?: string;

  @Prop()
  requirements?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
