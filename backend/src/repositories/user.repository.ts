import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

export class UserRepository {
  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  updateAdmin(id: number) {
    return prisma.user.update({ where: { id }, data: { admin: true } });
  }

  delete(id: number) {
    return prisma.user.delete({ where: { id } });
  }
}