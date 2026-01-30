import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER')?.trim(),
        pass: this.configService.get<string>('EMAIL_PASS')?.trim(),
      },
    });

    this.transporter.verify().then(() => {
      console.log('📧 Email transporter ready');
    });
  }

  /* -------------------------------- REGISTER -------------------------------- */

  async register(data: RegisterDto) {
    const { email, password, confirmPassword, firstName, lastName, role } = data;

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
      throw new BadRequestException('Password must be at least 6 characters long');
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
    const otp = this.generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const user = await this.userModel.create({
      ...data,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      verified: false,
    });

    await this.sendOtpEmail(email, otp);

    // Return only necessary information, exclude sensitive data
    return { 
      message: 'OTP sent to your email', 
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  /* -------------------------------- VERIFY OTP -------------------------------- */

  async verifyOtp(email: string, otp: string) {
    if (!email || !otp) {
      throw new BadRequestException('Email and OTP are required');
    }

    const user = await this.userModel.findOne({ email });

    if (
      !user ||
      !user.otp ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const validOtp = await bcrypt.compare(otp, user.otp);
    if (!validOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    user.verified = true;
    user.set('otp', undefined);
    user.set('otpExpires', undefined);
    await user.save();

    return { message: 'Account verified successfully' };
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

    const user = await this.userModel
      .findOne({ email })
      .select('+password');

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!user.verified) {
      await this.resendOtp(user);
      return {
        verified: false,
        message: 'Account not verified. OTP resent.',
        email,
      };
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

    const user = await this.userModel
      .findOne({ email })
      .select('-password -otp -otpExpires');

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(email: string, updates: any) {
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
      .select('firstName lastName email platform followers budget companyName role bio location')
      .limit(20); // Limit results to prevent excessive data transfer
  }

  async discoverSame(role: string, email: string) {
    if (!role || !email) {
      throw new BadRequestException('Role and email are required');
    }
    
    return this.userModel
      .find({ role, verified: true, email: { $ne: email } })
      .select('firstName lastName email platform followers budget companyName role bio location')
      .limit(20); // Limit results to prevent excessive data transfer
  }

  /* -------------------------------- HELPERS -------------------------------- */

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async resendOtp(user: UserDocument) {
    // Simple rate limiting using a separate field to track last OTP request time
    const now = Date.now();
    // Check if there was a previous OTP request
    const lastOtpRequest = user.lastOtpRequest ? user.lastOtpRequest.getTime() : 0;
    
    if (now - lastOtpRequest < 60_000) { // 1 minute
      throw new ForbiddenException(
        'Please wait before requesting another OTP',
      );
    }

    const otp = this.generateOtp();
    user.set('otp', await bcrypt.hash(otp, 10));
    user.set('otpExpires', new Date(now + 10 * 60 * 1000));
    user.set('lastOtpRequest', new Date(now)); // Track when OTP was last requested
    await user.save();

    await this.sendOtpEmail(user.email, otp);
  }

  private async sendOtpEmail(email: string, otp: string) {
    if (!email || !otp) {
      throw new BadRequestException('Email and OTP are required');
    }

    const from = this.configService.get<string>('EMAIL_USER');

    await this.transporter.sendMail({
      from: `"Sponsorly" <${from}>`,
      to: email,
      subject: 'Verify your Sponsorly account',
      html: `
        <div style="font-family:Arial;max-width:600px;margin:auto;padding:20px;">
          <h2 style="text-align:center;color:#d20f39">Sponsorly Verification</h2>
          <p>Hello,</p>
          <p>Your verification code is:</p>
          <div style="font-size:32px;font-weight:bold;text-align:center;background:#f8f9fa;padding:15px;border-radius:8px;margin:20px 0;">${otp}</div>
          <p>Please enter this code in the app to verify your account.</p>
          <p><strong>Note:</strong> This code expires in 10 minutes.</p>
          <hr style="margin:30px 0;" />
          <p style="font-size:0.8em;color:#6c757d;">If you didn't request this verification, please ignore this email.</p>
        </div>
      `,
    });
  }
}