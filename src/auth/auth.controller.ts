import { Controller, Post, Body, UseGuards, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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
  async discoverSame(@Body() body: { role: string; email: string; page?: number; limit?: number }) {
    const { role, email, page, limit } = body;
    return await this.authService.discoverSame(role, email, page, limit);
  }

  @Post('contact-support')
  async contactSupport(@Body() body: { name: string; email: string; message: string }) {
    return await this.authService.contactSupport(body);
  }
}
