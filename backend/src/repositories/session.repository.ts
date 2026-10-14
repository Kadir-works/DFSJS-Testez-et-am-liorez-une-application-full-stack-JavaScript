import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

const sessionInclude = {
  teacher: true,
  participants: { include: { user: true } },
} satisfies Prisma.SessionInclude;

export class SessionRepository {
  findAll() {
    return prisma.session.findMany({ include: sessionInclude });
  }

  findById(id: number) {
    return prisma.session.findUnique({ where: { id }, include: sessionInclude });
  }

  create(data: Prisma.SessionCreateInput) {
    return prisma.session.create({ data, include: sessionInclude });
  }

  update(id: number, data: Prisma.SessionUpdateInput) {
    return prisma.session.update({ where: { id }, data, include: sessionInclude });
  }

  delete(id: number) {
    return prisma.session.delete({ where: { id } });
  }

  findParticipation(sessionId: number, userId: number) {
    return prisma.sessionParticipation.findUnique({
      where: { sessionId_userId: { sessionId, userId } },
    });
  }

  createParticipation(sessionId: number, userId: number) {
    return prisma.sessionParticipation.create({ data: { sessionId, userId } });
  }

  deleteParticipation(sessionId: number, userId: number) {
    return prisma.sessionParticipation.delete({
      where: { sessionId_userId: { sessionId, userId } },
    });
  }
}