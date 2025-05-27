import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session, UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { SigningUserDto } from './dtos/signing-user.dto';
import { CurrentUser } from './decoretors/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}
  // @Get('whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }
  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  @Post('signout')
  singOut(@Session() session: any) {
    session.userId = null;
    return { message: 'User signed out successfully' };
  }
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(
      body.name,
      body.email,
      body.password,
    );
    session.userId = user.id;
    return user;
  }
  @Post('/signing')
  async signing(@Body() body: SigningUserDto, @Session() session: any) {
    const user = await this.authService.signing(body.email, body.password);
    session.userId = user.id;
    return user;
  }
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  async findAllUsers(@Query('name') name: string) {
    return await this.usersService.find(name);
  }

  @Get('/email/:email')
  async findUserByEmail(@Param('email') email: string) {
    return await this.usersService.find(email);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: Partial<UpdateUserDto>,
  ) {
    return await this.usersService.update(parseInt(id), body);
  }
}
