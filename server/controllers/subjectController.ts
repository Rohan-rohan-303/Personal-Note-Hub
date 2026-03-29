import type { Request, Response } from 'express';
import { PrismaClient } from '../prisma/generated/client';

const prisma = new PrismaClient();

export const createSubject = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;
    const userId = (req as any).user.id; 

    const newSubject = await prisma.subject.create({
      data: {
        name,
        color,
        userId
      }
    });

    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ message: "Could not create subject. It might already exist." });
  }
};

export const getMySubjects = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const subjects = await prisma.subject.findMany({
    where: { userId },
    include: { _count: { select: { notes: true } } } // Shows how many notes are in each
  });
  res.json(subjects);
};