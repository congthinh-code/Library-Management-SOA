import { Body, Controller, Get, Headers, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/create-user.dto';
import { UpdateUserDto } from '../users/update-user.dto';
import { AssignRolesDto } from '../users/assign-roles.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { RolesService } from '../roles/roles.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @Post('login')
  login(@Body() dto: LoginDto, @Headers('x-request-id') requestId?: string) {
    return this.authService.login(dto, requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser() user: { userId: string }, @Headers('x-request-id') requestId?: string) {
    return this.authService.logout(user, requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: { userId: string }) { return this.authService.me(user); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @Get('users')
  listUsers(@Query() query: PaginationQueryDto) {
    return this.usersService.list(query.page, query.limit, query.search);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('users')
  createUser(@Body() dto: CreateUserDto) { return this.usersService.create(dto); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) { return this.usersService.update(id, dto); }

  @UseGuards(JwtAuthGuard)
  @Get('roles')
  listRoles() { return this.rolesService.list(); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('users/:id/roles')
  assignRoles(@Param('id') id: string, @Body() dto: AssignRolesDto) {
    return this.usersService.assignRoles(id, dto.roles);
  }
}
