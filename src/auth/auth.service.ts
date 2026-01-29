import { Injectable, BadRequestException } from '@nestjs/common';
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
    const emailUser = this.configService.get<string>('EMAIL_USER')?.trim();
    const emailPass = this.configService.get<string>('EMAIL_PASS')?.trim();

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  async register(data: RegisterDto) {
    const { email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const newUser = new this.userModel({
      ...data,
      password: hashedPassword,
      otp,
      otpExpires,
      verified: false,
    });

    await newUser.save();

    // Send Real Email
    try {
      const emailUser = this.configService.get<string>('EMAIL_USER')?.trim();
      const info = await this.transporter.sendMail({
        from: `"Sponsorly" <${emailUser}>`,
        to: email,
        subject: 'Sponsorly - Verify Your Email',
        text: `Your OTP for Sponsorly registration is: ${otp}. It expires in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb; text-align: center;">Welcome to Sponsorly!</h2>
            <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your account:</p>
            <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 2rem; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px;">
              ${otp}
            </div>
            <p>This OTP will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.8rem; color: #6b7280; text-align: center;">&copy; 2026 Sponsorly. All rights reserved.</p>
          </div>
        `,
      });
      console.log('Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Email sending failed error details:', error);
    }

    console.log(`OTP for ${email}: ${otp}`);

    return { message: 'OTP sent to your email', email };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.userModel.findOne({
      email,
      otp,
      otpExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.verified = true;
    (user as any).otp = undefined;
    (user as any).otpExpires = undefined;
    await user.save();

    return { message: 'Account verified successfully' };
  }

  async getProfile(email: string) {
    const user = await this.userModel.findOne({ email }).select('-password -otp -otpExpires');
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async updateProfile(updateData: any) {
    const { email, ...updates } = updateData;
    
    // Remove email from updates since it's used as identifier
    delete updates.email;
    
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    return { message: 'Profile updated successfully', user };
  }

  async discover(role: string) {
    // If sponsor, see creators. If creator, see sponsors.
    const targetRole = role === 'sponsor' ? 'creator' : 'sponsor';
    return this.userModel.find({ role: targetRole, verified: true }).select('firstName lastName email platform followers budget companyName role');
  }

  async discoverSame(role: string, email: string) {
    return this.userModel.find({ 
      role: role, 
      verified: true,
      email: { $ne: email } 
    }).select('firstName lastName email platform followers budget companyName role');
  }

  async login(data: LoginDto) {
    const { email, password } = data;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!user.verified) {
      // Resend OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      await this.sendOtpEmail(email, otp);

      return { 
        message: 'Account not verified. A new OTP has been sent to your email.', 
        verified: false,
        email 
      };
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { 
      message: 'Login successful', 
      verified: true,
      access_token: token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    };
  }

  private async sendOtpEmail(email: string, otp: string) {
    try {
      const emailUser = this.configService.get<string>('EMAIL_USER')?.trim();
      await this.transporter.sendMail({
        from: `"Sponsorly" <${emailUser}>`,
        to: email,
        subject: 'Sponsorly - Verify Your Email',
        text: `Your OTP for Sponsorly registration is: ${otp}. It expires in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb; text-align: center;">Welcome to Sponsorly!</h2>
            <p>Please use the following One-Time Password (OTP) to verify your account:</p>
            <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 2rem; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px;">
              ${otp}
            </div>
            <p>This OTP will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.8rem; color: #6b7280; text-align: center;">&copy; 2026 Sponsorly. All rights reserved.</p>
          </div>
        `,
      });
      console.log(`OTP sent to ${email}: ${otp}`);
    } catch (error) {
      console.error('Email sending failed error details:', error);
    }
  }
}
