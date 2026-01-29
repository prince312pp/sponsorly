import { IsEmail, IsNotEmpty, MinLength, IsString, IsEnum, IsOptional, IsNumber, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LinkDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  confirmPassword: string;

  @IsEnum(['creator', 'sponsor'])
  role: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  links?: LinkDto[];

  // Creator specific
  @IsString()
  @IsOptional()
  platform?: string;

  @IsString()
  @IsOptional()
  handle?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  followers?: number;

  @IsDateString()
  @IsOptional()
  dob?: string;

  @IsString()
  @IsOptional()
  audienceReach?: string;

  // Sponsor specific
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  noOfEmployees?: string;

  @IsString()
  @IsOptional()
  budget?: string;

  @IsString()
  @IsOptional()
  requirements?: string;
}
