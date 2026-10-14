import { AppError } from '../errors/app-error';
import { UserRepository } from '../repositories/user.repository';

export class UserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async getById(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError(404, 'User not found');
    return this.toPublicUser(user);
  }

  async delete(id: number, authenticatedUserId?: number): Promise<void> {
    if (authenticatedUserId !== id) {
      throw new AppError(403, 'You can only delete your own account');
    }
    await this.getById(id);
    await this.userRepository.delete(id);
  }

  async promoteSelfToAdmin(userId?: number) {
    if (process.env.NODE_ENV !== 'production' && userId) {
      const user = await this.userRepository.findById(userId);
      if (!user) throw new AppError(404, 'User not found');
      const updatedUser = user.admin ? user : await this.userRepository.updateAdmin(userId);
      return this.toPublicUser(updatedUser);
    }
    throw new AppError(403, 'Admin self-promotion is only available in development');
  }

  toPublicUser(user: { id: number; email: string; firstName: string; lastName: string; admin: boolean; createdAt: Date; updatedAt: Date }) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      admin: user.admin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}