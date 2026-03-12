/**
 * seed-admin.ts — Creates the first admin account.
 *
 * Run once after setting up the database:
 *   npx ts-node prisma/seed-admin.ts
 *
 * Or add to package.json scripts:
 *   "seed:admin": "ts-node prisma/seed-admin.ts"
 */

import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@docnear.in';
  const password = process.env.ADMIN_PASSWORD ?? 'DocNear@Admin123';
  const name = process.env.ADMIN_NAME ?? 'DocNear Admin';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ Admin already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      email,
      mobile: process.env.ADMIN_MOBILE ?? '0000000000', // placeholder
      name,
      role: 'super_admin',
      isActive: true,
      isVerified: true,
    },
  });

  console.log(`✅ Admin created!`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   ID: ${admin.id}`);
  console.log(`\n⚠️  IMPORTANT: Set the following environment variable for the backend:`);
  console.log(`   ADMIN_PASSWORD_HASH="${passwordHash}"`);
  console.log(`\n   Add this to your .env.local (backend) or deployment config.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
