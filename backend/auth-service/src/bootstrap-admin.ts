
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const username = process.env.BOOTSTRAP_ADMIN_USERNAME;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error('Missing bootstrap admin credentials');
  }

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const usersService = app.get(UsersService);

    const user = await usersService.create({
      username,
      password,
      isActive: true,
      roles: ['ADMIN'],
    });

    console.log('Admin account created successfully:', user);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error('Failed to create admin:', error.message);
  process.exitCode = 1;
});
