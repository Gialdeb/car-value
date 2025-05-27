import { IsEmail, IsString } from 'class-validator';
export class SigningUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
