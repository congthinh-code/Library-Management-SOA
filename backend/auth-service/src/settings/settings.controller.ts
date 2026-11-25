import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { IsString, MaxLength } from 'class-validator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SettingsService } from './settings.service';

class UpdateSettingDto {
  @IsString()
  @MaxLength(4000)
  settingValue: string;
}

@Controller('auth/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}
  @Get() list() { return this.settingsService.list(); }
  @Patch(':key') update(@Param('key') key: string, @Body() dto: UpdateSettingDto) {
    return this.settingsService.update(key, dto.settingValue);
  }
}
