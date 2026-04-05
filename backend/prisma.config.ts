import { defineConfig } from '@prisma/config'
import 'dotenv/config' // Forces Prisma to read your .env file

export default defineConfig({
  migrations: {
    seed: 'node ./prisma/seed.js',
  },
  datasource: {
    url: process.env.DATABASE_URL
  }
})