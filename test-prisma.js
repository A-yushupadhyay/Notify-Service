
require("dotenv").config();
console.log("ENV DATABASE_URL set?", !!process.env.DATABASE_URL);
try {
  const { PrismaClient } = require("@prisma/client");
  console.log("PrismaClient import ok");
  const p = new PrismaClient();
  console.log("PrismaClient constructed OK");
  p.$disconnect().then(()=>console.log("disconnect done")).catch(()=>{});
} catch (e) {
  console.error("ERROR creating PrismaClient:");
  console.error(e && e.stack ? e.stack : e);
  process.exit(1);
}
