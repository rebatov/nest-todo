import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserInterface {
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  firstName?: string

  @IsString()
  @IsOptional()
  lastName?: string

  @IsString()
  @IsOptional()
  address?: string
}