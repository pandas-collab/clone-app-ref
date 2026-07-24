import { defineConfig } from '@prisma/client/extension'

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/database"
    }
  }
})
