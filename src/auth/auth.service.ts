import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from '../users/schemas/user.schema';
import { SupportTicket, SupportTicketDocument } from '../support/schemas/support-ticket.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(SupportTicket.name) private supportTicketModel: Model<SupportTicketDocument>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) { }

  /* -------------------------------- REGISTER -------------------------------- */

  async register(data: RegisterDto) {
    const { email, password, confirmPassword, firstName, lastName, role } =
      data;

    // Validate input data
    if (!email || !password || !firstName || !lastName || !role) {
      throw new BadRequestException('Missing required fields');
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new BadRequestException('Invalid email format');
    }

    // Validate password strength
    if (password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long',
      );
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Extract all fields from registration data
    const userData: any = {
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    };

    // Add optional fields if they exist
    const optionalFields = [
      'bio',
      'location',
      'links',
      'platform',
      'handle',
      'followers',
      'audienceReach',
      'dob',
      'companyName',
      'noOfEmployees',
      'budget',
      'requirements',
    ];

    optionalFields.forEach((field) => {
      if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
        userData[field] = data[field];
      }
    });

    const user = await this.userModel.create(userData);

    return {
      message: 'Registration successful.',
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  /* -------------------------------- LOGIN -------------------------------- */

  async login(data: LoginDto) {
    const { email, password } = data;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new BadRequestException('Invalid email format');
    }

    const user = await this.userModel.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.jwtService.sign(
      { sub: user._id, email: user.email, role: user.role },
      { expiresIn: '1d' },
    );

    return {
      access_token: token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }

  /* -------------------------------- PROFILE -------------------------------- */

  async getProfile(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const normalizedEmail = email.toLowerCase();
    const user = await this.userModel.findOne({ email: normalizedEmail }).select('-password');

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(email: string, updates: Record<string, any>) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const allowedFields = [
      'firstName',
      'lastName',
      'bio',
      'location',
      'links',
      'platform',
      'handle',
      'followers',
      'audienceReach',
      'dob',
      'companyName',
      'noOfEmployees',
      'budget',
      'requirements',
    ];

    // Filter updates to only allow safe fields
    const safeUpdates: any = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        // If updating links, ensure it's an array of LinkDto-like objects
        if (key === 'links' && Array.isArray(value)) {
          safeUpdates[key] = value.filter(link =>
            link && typeof link.label === 'string' && typeof link.url === 'string'
          );
        } else {
          safeUpdates[key] = value;
        }
      }
    }

    const normalizedEmail = email.toLowerCase();
    const user = await this.userModel.findOneAndUpdate(
      { email: normalizedEmail },
      { $set: safeUpdates },
      { new: true, runValidators: true },
    );

    if (!user) throw new NotFoundException('User not found');

    return { message: 'Profile updated successfully', user };
  }

  /* -------------------------------- DISCOVER -------------------------------- */

  async discover(role: string) {
    if (!role) {
      throw new BadRequestException('Role is required');
    }

    const targetRole = role;
    return this.userModel
      .find({ role: targetRole })
      .select(
        'firstName lastName email platform followers budget companyName role bio location',
      );
  }

  async discoverSame(role: string, email: string, page: number = 1, limit: number = 9) {
    if (!role || !email) {
      throw new BadRequestException('Role and email are required');
    }

    const normalizedEmail = email.toLowerCase();
    const query: any = { email: { $ne: normalizedEmail } };
    if (role && role !== 'all') {
      query.role = role.toLowerCase();
    }

    this.logger.log(`Discovering users with query: ${JSON.stringify(query)}`);

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .select('firstName lastName email platform followers budget companyName role bio location')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(query),
    ]);

    return { users, total };
  }

  /* -------------------------------- SUPPORT -------------------------------- */

  async contactSupport(data: { name: string; email: string; message: string }) {
    const { name, email, message } = data;

    if (!name || !email || !message) {
      throw new BadRequestException('All fields (name, email, message) are required');
    }

    // Save ticket to database
    const ticket = await this.supportTicketModel.create({
      name,
      email,
      message,
    });

    this.logger.log(`Saved contact support request from ${name} (${email}) with ID: ${ticket._id}`);

    return {
      success: true,
      message: 'Message received. We will get back to you soon.',
    };
  }
}
