import { prisma } from './prisma';

export class TeacherRepository {
  findAll() {
    return prisma.teacher.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: number) {
    return prisma.teacher.findUnique({ where: { id } });
  }
}