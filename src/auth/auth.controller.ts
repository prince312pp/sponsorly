import { Controller, Post, Body, UseGuards, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto, VerifyOtpDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async getProfile(@Body() body: { email: string }) {
    return this.authService.getProfile(body.email);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  async updateProfile(@Body() updateData: any) {
    // Extract email from the request object (available via JWT guard)
    // For now, we'll extract email from the request body as well
    const { email, ...updates } = updateData;
    return this.authService.updateProfile(email, updates);
  }

  @UseGuards(JwtAuthGuard)
  @Post('discover')
  async discover(@Body() body: { role: string }) {
    return this.authService.discover(body.role);
  }

  @UseGuards(JwtAuthGuard)
  @Post('discover-same')
  async discoverSame(@Body() body: { role: string; email: string }) {
    return this.authService.discoverSame(body.role, body.email);
  }
}
