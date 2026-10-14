import { Response } from 'express';
import { AppError } from '../errors/app-error';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserService } from '../services/user.service';

export class UserController {
  constructor(private readonly userService = new UserService()) {}

  async getById(req: AuthRequest, res: Response): Promise<void> {
    res.status(200).json(await this.userService.getById(this.parseId(req.params.id)));
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.parseId(req.params.id);
    await this.userService.delete(userId, req.userId);
    res.status(200).json({ message: 'User deleted successfully' });
  }

  async promoteSelfToAdmin(req: AuthRequest, res: Response): Promise<void> {
    if (!req.userId) throw new AppError(401, 'Unauthorized');
    res.status(200).json(await this.userService.promoteSelfToAdmin(req.userId));
  }

  private parseId(value: string | string[] | undefined): number {
    if (!value || typeof value !== 'string') throw new AppError(400, 'User ID is required');
    const id = Number(value);
    if (!Number.isInteger(id)) throw new AppError(400, 'Invalid user ID');
    return id;
  }
}
