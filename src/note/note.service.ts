import { PrismaService } from '@App/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  async getNotes(userId: number) {
    const notes = await this.prismaService.note.findMany({
      where: {
        userId,
      },
      take: 3,
    });
    return notes;
  }

  async insertNote(userId: number, insertNoteDTO: InsertNoteDTO) {
    const note = await this.prismaService.note.create({
      data: {
        ...insertNoteDTO,
        userId,
      },
    });
    return note;
  }

  async getNoteById(noteId: number) {
    const note = await this.prismaService.note.findUnique({
      where: { id: noteId },
    });
    return note;
  }

  async updateNoteById(noteId: number, updateNoteDTO: UpdateNoteDTO) {
    const noteUpdated = await this.prismaService.note.update({
      where: {
        id: noteId,
      },
      data: updateNoteDTO,
    });
    return noteUpdated;
  }
  async deleteNoteById(noteId: number) {
    await this.prismaService.note.delete({
      where: { id: noteId },
    });
    return;
  }
}
