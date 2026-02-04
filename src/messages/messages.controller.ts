import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('send')
  sendMessage(
    @Body() _messageData: { receiverEmail: string; content: string },
  ) {
    // The sender email will be extracted from the JWT token
    return { message: 'Message sent successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('conversation')
  getMessages(@Body() _conversationData: { otherUserEmail: string }) {
    // The current user email will be extracted from the JWT token
    return { messages: [] };
  }

  @UseGuards(JwtAuthGuard)
  @Get('conversations')
  getConversations() {
    // The current user email will be extracted from the JWT token
    return { conversations: [] };
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  getUnreadCount() {
    // The current user email will be extracted from the JWT token
    return { count: 0 };
  }
}
