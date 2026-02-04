import { Controller, Post, Body, UseGuards, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async getProfile(@Body() body: { email: string }) {
    return await this.authService.getProfile(body.email);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  async updateProfile(@Body() updateData: Record<string, any>) {
    // Extract email from the request object (available via JWT guard)
    // For now, we'll extract email from the request body as well
    const { email, ...updates } = updateData;
    return await this.authService.updateProfile(email, updates);
  }

  @UseGuards(JwtAuthGuard)
  @Post('discover')
  async discover(@Body() body: { role: string }) {
    return await this.authService.discover(body.role);
  }

  @UseGuards(JwtAuthGuard)
  @Post('discover-same')
  async discoverSame(@Body() body: { role: string; email: string }) {
    return await this.authService.discoverSame(body.role, body.email);
  }

  @Post('contact-support')
  async contactSupport(
    @Body() contactData: { name: string; email: string; message: string },
  ) {
    // Simple contact support implementation
    // In a real application, you would send an email or store in database
    console.log('Contact Support Request:', contactData);
    return {
      message: 'Thank you for your message. We will get back to you soon.',
    };
  }
}
