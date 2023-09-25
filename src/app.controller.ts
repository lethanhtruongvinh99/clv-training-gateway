import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { AuthUserDecorator } from './decorators/auth-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { RoleEnum } from './decorators/roles.enum';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreateRoleDto } from './dto/create-role-dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthenticationGuard } from './guards/auth.guard';
import { GoogleAuthGuard } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { RolesGuard } from './guards/roles.guard';
import { CreateVesselDto } from './dto/create-vessel-dto';
import { AuthenticationGuardVersion2 } from './guards/authver2.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // authen zone
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@AuthUserDecorator() user: any) {
    return this.appService.login(user);
  }

  @Post('auth/signup')
  async signup(@Body() user: CreateUserDto) {
    return this.appService.signup(user);
  }

  // google sign in
  @UseGuards(GoogleAuthGuard)
  @Get('auth/google')
  async googleAuth(@Req() req: Request) {}
  @UseGuards(GoogleAuthGuard)
  @Get('auth/redirect')
  async googleAuthRedirect(
    @AuthUserDecorator() user: any,
    @Res() res: Response,
  ) {
    const validatedUser = await this.appService.googleLogin(user);
    res.redirect(
      `http://localhost:3004/auth/redirect/?access_token=${validatedUser?.access_token}`,
    );
  }

  // user zone
  // @Roles(RoleEnum.Admin)
  // @UseGuards(AuthenticationGuard, RolesGuard)
  @UseGuards(AuthenticationGuardVersion2)
  @Get('users')
  getUsers(@Query() queries: any) {
    return this.appService.getUsers(queries);
  }

  @UseGuards(AuthenticationGuard)
  @Post('users')
  createUser(@Body() user: CreateUserDto) {
    return this.appService.createUser(user);
  }

  @UseGuards(AuthenticationGuard)
  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.appService.getUser(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() user: CreateUserDto) {
    return this.appService.updateUser(+id, user);
  }

  // role zone
  // @Roles(RoleEnum.Admin)
  // @UseGuards(AuthenticationGuard, RolesGuard)
  @Get('roles')
  getRoles(@Query() queries: any) {
    return this.appService.getRoles(queries);
  }

  @UseGuards(AuthenticationGuard)
  @Post('roles')
  createRole(@Body() role: CreateRoleDto) {
    return this.appService.createRole(role);
  }

  @UseGuards(AuthenticationGuard)
  @Get('roles/:id')
  getRole(@Param('id') id: string) {
    return this.appService.getRole(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('roles/:id')
  updateRole(@Param('id') id: string, @Body() role: CreateRoleDto) {
    return this.appService.updateRole(+id, role);
  }

  // permission zone
  @Roles(RoleEnum.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Get('permissions')
  getPermissions(@Query() queries: any) {
    return this.appService.getPermissions(queries);
  }

  @UseGuards(AuthenticationGuard)
  @Post('permissions')
  createPermission(@Body() permission: CreatePermissionDto) {
    return this.appService.createPermission(permission);
  }

  @UseGuards(AuthenticationGuard)
  @Get('permissions/:id')
  getPermission(@Param('id') id: string) {
    return this.appService.getPermission(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('permissions/:id')
  updatePermission(
    @Param('id') id: string,
    @Body() permission: CreatePermissionDto,
  ) {
    return this.appService.updatePermission(+id, permission);
  }

  // vessel zone
  @UseGuards(AuthenticationGuard)
  @Get('vessels')
  getVessels(@Query() queries: any) {
    return this.appService.getVessels(queries);
  }

  @UseGuards(AuthenticationGuard)
  @Post('vessels')
  createVessel(@Body() vessel: CreateVesselDto) {
    return this.appService.createVessel(vessel);
  }

  @UseGuards(AuthenticationGuard)
  @Get('vessels/:vessel_code')
  getVessel(@Param('vessel_code') vessel_code: string) {
    return this.appService.getVessel(vessel_code);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('vessels/:vessel_code')
  updateVessel(
    @Param('vessel_code') vessel_code: string,
    @Body() vessel: CreateVesselDto,
  ) {
    return this.appService.updateVessel(vessel_code, vessel);
  }
}
