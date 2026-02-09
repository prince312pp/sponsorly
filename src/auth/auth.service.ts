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
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Extract all fields from registration data
    const userData: any = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      verified: true, // Auto-verify users
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    const user = await this.userModel.findOne({ email }).select('+password');

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
      verified: true,
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

    const user = await this.userModel.findOne({ email }).select('-password');

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
    const safeUpdates = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        safeUpdates[key] = value;
      }
    }

    const user = await this.userModel.findOneAndUpdate(
      { email },
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

    const targetRole = role === 'sponsor' ? 'creator' : 'sponsor';
    return this.userModel
      .find({ role: targetRole, verified: true })
      .select(
        'firstName lastName email platform followers budget companyName role bio location',
      );
  }

  async discoverSame(role: string, email: string) {
    if (!role || !email) {
      throw new BadRequestException('Role and email are required');
    }

    const query: any = { verified: true, email: { $ne: email } };
    if (role && role !== 'all') {
      query.role = role;
    }

    this.logger.log(`Discovering users with query: ${JSON.stringify(query)}`);

    return this.userModel
      .find(query)
      .select(
        'firstName lastName email platform followers budget companyName role bio location',
      );
  }

  /* -------------------------------- SUPPORT -------------------------------- */

  async contactSupport(data: { name: string; email: string; message: string }) {
    const { name, email, message } = data;

    if (!name || !email || !message) {
      throw new BadRequestException('All fields (name, email, message) are required');
    }

    // In a real app, this would send an email or save to a "SupportTicket" collection.
    // For now, we log it and return success to satisfy the frontend.
    this.logger.log(`Received contact support request from ${name} (${email}): ${message}`);

    return {
      success: true,
      message: 'Message received. We will get back to you soon.',
    };
  }
}
