import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SupportTicketDocument = SupportTicket & Document;

@Schema({ timestamps: true })
export class SupportTicket {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    message: string;

    @Prop({ default: 'open' })
    status: string;
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);
