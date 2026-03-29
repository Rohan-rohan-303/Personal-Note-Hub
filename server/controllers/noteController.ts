import type { Request, Response } from 'express';
import { PrismaClient } from '../prisma/generated/client';

const prisma = new PrismaClient();

export const noteController = {
    // Get all notes, potentially filtered by subject
    getNotes: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const subjectId = req.query.subjectId as string;

            const notes = await prisma.note.findMany({
                where: {
                    userId,
                    ...(subjectId && { subjectId: parseInt(subjectId as string) })
                },
                orderBy: { createdAt: 'desc' }
            });
            res.json(notes);
        } catch (err) {
            res.status(500).json({ error: "Error retrieving notes" });
        }
    },

    // Create a note
    createNote: async (req: Request, res: Response) => {
        try {
            const { title, content, subjectId } = req.body;
            const userId = (req as any).user.id;

            const newNote = await prisma.note.create({
                data: { title, content, subjectId, userId }
            });
            res.status(201).json(newNote);
        } catch (err) {
            res.status(500).json({ error: "Error saving note" });
        }
    },

    // Update a note
    updateNote: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { title, content, subjectId } = req.body;
            const userId = (req as any).user.id;

            const updatedNote = await prisma.note.updateMany({
                where: { id, userId },
                data: { title, content, subjectId }
            });

            if (updatedNote.count === 0) return res.status(404).json("Note not found");
            res.json({ message: "Note updated successfully" });
        } catch (err) {
            res.status(500).json({ error: "Update failed" });
        }
    },

    // Delete a note
    deleteNote: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;

            await prisma.note.deleteMany({
                where: { id, userId }
            });
            res.json({ message: "Note deleted successfully" });
        } catch (err) {
            res.status(500).json({ error: "Delete failed" });
        }
    }
};