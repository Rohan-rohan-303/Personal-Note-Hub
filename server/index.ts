import express from 'express';
import { PrismaClient } from './prisma/generated/client';
const app = express();
const prisma = new PrismaClient();

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});