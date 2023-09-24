import prisma from "~/lib/prisma.server";
import bcrypt from "bcryptjs";

async function seed() {
  const user1Email = 'jan@prisma.io'
  const user2Email = 'petra@prisma.io'

  // cleanup existing db
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [user1Email, user2Email]
      }
    }
  }).catch(() => {/** exit if no user exists */ })

  const user1PasswordHash = await bcrypt.hash("jan@prisma", 10)
  const user2PasswordHash = await bcrypt.hash("petra@prisma", 10)

  await prisma.user.create({
    data: {
      email: user1Email,
      name: 'Jan',
      password: {
        create: { hash: user1PasswordHash }
      },
      posts: {
        create: [
          {
            title: 'Join the Prisma Slack',
            content: 'https://slack.prisma.io',
            published: true,
          },
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://www.twitter.com/prisma',
            published: true,
          },
        ]
      }
    },
    include: {
      posts: true
    }
  })

  await prisma.user.create({
    data: {
      email: user2Email,
      name: 'Petra',
      password: {
        create: { hash: user2PasswordHash }
      },
      posts: {
        create: [
          {
            title: 'Ask a question about Prisma on GitHub',
            content: 'https://www.github.com/prisma/prisma/discussions',
            published: true,
          },
          {
            title: 'Prisma on YouTube',
            content: 'https://pris.ly/youtube',
          },
        ]
      }
    },
    include: {
      posts: true
    }
  })



  console.log(`Database has been seeded. 🌱`);

}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
