import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  async login(dto: LoginDto, requestId?: string) {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user || !user.isActive || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      await this.auditLogs.write(null, 'LOGIN_FAILED', 'auth', requestId, { username: dto.username });
      throw new UnauthorizedException('Invalid username or password');
    }
    const roles = await this.usersService.getRoleNames(user.userId);
    const accessToken = await this.jwtService.signAsync({ sub: user.userId, username: user.username, roles });
    await this.auditLogs.write(user.userId, 'LOGIN_SUCCESS', 'auth', requestId);
    return {
      data: {
        accessToken,
        tokenType: 'Bearer',
        user: { userId: user.userId, username: user.username, email: user.email, roles },
      },
      message: 'Login successful',
    };
  }

  async me(user: { userId: string }) {
    return { data: await this.usersService.findPublicById(user.userId), message: 'Success' };
  }

  async logout(user: { userId: string }, requestId?: string) {
    // Access tokens are stateless; the client must discard its token on logout.
    await this.auditLogs.write(user.userId, 'LOGOUT', 'auth', requestId);
    return { data: null, message: 'Logged out. Discard the access token on the client.' };
  }
}
