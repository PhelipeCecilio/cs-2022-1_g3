import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const userData: Prisma.userCreateInput[] = [
  {
    name: "Arthur Admin",
    email: "arthur_admin@hyerdev.com",
    role: "ADMIN",
    password: "123456",
  },
  {
    name: "Arthur User",
    email: "arthur_user@hyerdev.com",
    role: "USER",
    password: "123456",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    try {
      const user = await prisma.user.create({
        data: {
          ...u,
          password: await bcrypt.hash(u.password, 10),
        },
      });
      console.log(`Created user with id: ${user.id}`);
    } catch (e) {
      console.log(e);
    }
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
