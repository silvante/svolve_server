// prisma-console.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  // @ts-ignore
  global.prisma = prisma;

  const repl = require('repl');

  const replServer = repl.start({
    prompt: 'prisma > ',
  });

  replServer.context.prisma = prisma;
})();
