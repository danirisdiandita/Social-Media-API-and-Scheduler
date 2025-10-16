import { Config } from "@/constants/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaNeon } from '@prisma/adapter-neon'
const connString = Config.DATABASE_URL
let adapter = null 
if (Config.DATABASE_ADAPTER === "neon") {
    adapter = new PrismaNeon({ connectionString: connString })
} else {
    adapter = new PrismaPg({ connectionString: connString })
}
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || (adapter ? new PrismaClient({ adapter }) : new PrismaClient());
if (Config.NODE_ENV !== "production") globalForPrisma.prisma = prisma;