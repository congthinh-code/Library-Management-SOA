import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import dataSource from '../data-source';
import { Role } from '../../roles/role.entity';
import { UserRole } from '../../users/user-role.entity';
import { User } from '../../users/user.entity';

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password || password.length < 12) {
    throw new Error('Set ADMIN_USERNAME and ADMIN_PASSWORD (at least 12 characters) in the local .env file.');
  }

  await dataSource.initialize();
  try {
    const users = dataSource.getRepository(User);
    const roles = dataSource.getRepository(Role);
    const userRoles = dataSource.getRepository(UserRole);
    const existing = await users.findOne({ where: { username } });
    if (existing) {
      process.stdout.write(`User ${username} already exists; no changes made.\n`);
      return;
    }

    const adminRole = await roles.findOne({ where: { roleName: 'ADMIN' } });
    if (!adminRole) throw new Error('ADMIN role not found. Run the Auth migration first.');

    const user = await users.save(users.create({
      username,
      email: null,
      passwordHash: await bcrypt.hash(password, 12),
      isActive: true,
    }));
    await userRoles.save(userRoles.create({ userId: user.userId, roleId: adminRole.roleId }));
    process.stdout.write(`Created administrator account: ${username}\n`);
  } finally {
    await dataSource.destroy();
  }
}

seedAdmin().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
