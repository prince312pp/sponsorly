import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class MessagesService {
  private logger = new Logger(MessagesService.name);

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async sendMessage(senderEmail: string, receiverEmail: string, content: string) {
    if (!senderEmail || !receiverEmail || !content) {
      throw new BadRequestException('Sender, receiver, and content are required');
    }

    if (content.trim().length === 0) {
      throw new BadRequestException('Message content cannot be empty');
    }

    // Find users by email
    const sender = await this.userModel.findOne({ email: senderEmail });
    const receiver = await this.userModel.findOne({ email: receiverEmail });

    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    if (sender.email === receiver.email) {
      throw new BadRequestException('Cannot send message to yourself');
    }

    const message = await this.messageModel.create({
      sender: sender._id,
      receiver: receiver._id,
      content: content.trim(),
      read: false,
      timestamp: new Date(),
    });

    // Populate sender and receiver info
    await message.populate('sender', 'firstName lastName email');
    await message.populate('receiver', 'firstName lastName email');

    this.logger.log(`Message sent from ${sender.email} to ${receiver.email}`);
    return message;
  }

  async getMessages(userEmail: string, otherUserEmail: string) {
    if (!userEmail || !otherUserEmail) {
      throw new BadRequestException('Both user emails are required');
    }

    const user = await this.userModel.findOne({ email: userEmail });
    const otherUser = await this.userModel.findOne({ email: otherUserEmail });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!otherUser) {
      throw new NotFoundException('Other user not found');
    }

    const messages = await this.messageModel
      .find({
        $or: [
          { sender: user._id, receiver: otherUser._id },
          { sender: otherUser._id, receiver: user._id },
        ],
      })
      .populate('sender', 'firstName lastName email')
      .populate('receiver', 'firstName lastName email')
      .sort({ timestamp: 1 });

    // Mark messages as read
    await this.messageModel.updateMany(
      { receiver: user._id, sender: otherUser._id, read: false },
      { read: true },
    );

    return messages;
  }

  async getConversations(userEmail: string) {
    if (!userEmail) {
      throw new BadRequestException('User email is required');
    }

    const user = await this.userModel.findOne({ email: userEmail });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get all messages where user is sender or receiver
    const messages = await this.messageModel
      .find({
        $or: [{ sender: user._id }, { receiver: user._id }],
      })
      .populate('sender', 'firstName lastName email')
      .populate('receiver', 'firstName lastName email')
      .sort({ timestamp: -1 });

    // Group by conversation partner
    const conversations = new Map();
    
    messages.forEach(message => {
      const sender = message.sender as any;
      const receiver = message.receiver as any;
      const otherUser = sender.email === userEmail ? receiver : sender;
      
      const key = otherUser.email;
      if (!conversations.has(key)) {
        conversations.set(key, {
          user: otherUser,
          lastMessage: message,
          unreadCount: receiver.email === userEmail && !message.read ? 1 : 0,
        });
      } else {
        const convo = conversations.get(key);
        if (receiver.email === userEmail && !message.read) {
          convo.unreadCount++;
        }
        if (message.timestamp > convo.lastMessage.timestamp) {
          convo.lastMessage = message;
        }
      }
    });

    return Array.from(conversations.values())
      .sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
  }

  async getUnreadCount(userEmail: string) {
    if (!userEmail) {
      throw new BadRequestException('User email is required');
    }

    const user = await this.userModel.findOne({ email: userEmail });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.messageModel.countDocuments({
      receiver: user._id,
      read: false,
    });
  }
}