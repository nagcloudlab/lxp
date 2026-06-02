import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = resolve(__dirname, "..", "dev.db");

const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

const demoUsers = [
  { id: "user_admin", name: "Admin User", email: "admin@company.com", password: "admin123", role: "ld_admin" },
  { id: "user_sme", name: "Dr. Sarah Chen", email: "sarah@company.com", password: "sme123", role: "sme" },
  { id: "user_instructor", name: "James Wilson", email: "james@company.com", password: "instructor123", role: "instructor" },
  { id: "user_learner", name: "Ananya Rao", email: "ananya@company.com", password: "learner123", role: "learner" },
  { id: "user_manager", name: "Michael Torres", email: "michael@company.com", password: "manager123", role: "manager" }
];

async function main() {
  for (const user of demoUsers) {
    const hashed = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, password: hashed, role: user.role },
      create: { id: user.id, name: user.name, email: user.email, password: hashed, role: user.role }
    });
    console.log(`Seeded: ${user.name} (${user.role})`);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
