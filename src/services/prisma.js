// src/services/prisma.js
require("dotenv").config(); // ensure env loaded if running via node directly
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient(); // <-- NO options here for Prisma 7

module.exports = prisma;
