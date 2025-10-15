import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password_hash: 'hashedpassword',
      name: 'Test User'
    }
  });
  console.log(user);
}

main().finally(() => process.exit());
