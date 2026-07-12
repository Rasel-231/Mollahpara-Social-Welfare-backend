import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const defaultCategories = [
  { name: 'bloodDonation', label: 'রক্তদান', icon: '🩸', sortOrder: 1 },
  { name: 'relief', label: 'ত্রাণ', icon: '🎁', sortOrder: 2 },
  { name: 'education', label: 'শিক্ষা', icon: '📚', sortOrder: 3 },
  { name: 'event', label: 'অনুষ্ঠান', icon: '🎊', sortOrder: 4 },
  { name: 'other', label: 'অন্যান্য', icon: '📸', sortOrder: 5 },
];

async function main() {
  for (const cat of defaultCategories) {
    const existing = await prisma.galleryCategory.findUnique({ where: { name: cat.name } });
    if (!existing) {
      await prisma.galleryCategory.create({ data: cat });
      console.log(`Created: ${cat.label}`);
    } else {
      console.log(`Already exists: ${cat.label}`);
    }
  }
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
