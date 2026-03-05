import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

// import "dotenv/config"
// import { defineConfig, env } from "prisma/config"

// console.log("DB URL:", process.env.DATABASE_URL)

// export default defineConfig({
//     schema: "prisma/schema.prisma",
//     migrations: {
//         path: "prisma/migrations",
//     },
//     datasource: {
//         url: env("DATABASE_URL")
//     }
// })
