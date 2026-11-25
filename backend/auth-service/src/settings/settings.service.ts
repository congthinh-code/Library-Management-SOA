import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from './system-setting.entity';

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(SystemSetting) private readonly settings: Repository<SystemSetting>) {}
  async list() {
    const data = await this.settings.find({ order: { settingKey: 'ASC' } });
    return { data, message: 'Success' };
  }
  async update(key: string, value: string) {
    const setting = await this.settings.findOne({ where: { settingKey: key } });
    if (!setting) throw new NotFoundException('Setting not found');
    setting.settingValue = value;
    return { data: await this.settings.save(setting), message: 'Setting updated' };
  }
}
