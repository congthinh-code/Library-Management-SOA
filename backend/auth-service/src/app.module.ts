import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuditLog } from './audit-logs/audit-log.entity';
import { AuditLogsController } from './audit-logs/audit-logs.controller';
import { AuditLogsService } from './audit-logs/audit-logs.service';
import { RolesGuard } from './common/guards/roles.guard';
import { Role } from './roles/role.entity';
import { RolesService } from './roles/roles.service';
import { SettingsController } from './settings/settings.controller';
import { SystemSetting } from './settings/system-setting.entity';
import { SettingsService } from './settings/settings.service';
import { UserRole } from './users/user-role.entity';
import { User } from './users/user.entity';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig()),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'change-this-secret-in-env'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '8h') as `${number}${'s' | 'm' | 'h' | 'd'}` },
      }),
    }),
    TypeOrmModule.forFeature([User, Role, UserRole, SystemSetting, AuditLog]),
  ],
  controllers: [AppController, AuthController, SettingsController, AuditLogsController],
  providers: [AppService, AuthService, UsersService, RolesService, SettingsService, AuditLogsService, JwtStrategy, RolesGuard],
})
export class AppModule {}
