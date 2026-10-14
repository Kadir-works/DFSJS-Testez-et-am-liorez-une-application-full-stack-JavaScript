import { Response } from 'express';
import { AppError } from '../errors/app-error';
import { AuthRequest } from '../middleware/auth.middleware';
import { TeacherService } from '../services/teacher.service';

export class TeacherController {
  constructor(private readonly teacherService = new TeacherService()) {}

  async getAll(_req: AuthRequest, res: Response): Promise<void> {
    res.status(200).json(await this.teacherService.getAll());
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    const teacherId = this.parseId(req.params.id, 'Teacher');
    res.status(200).json(await this.teacherService.getById(teacherId));
  }

  private parseId(value: string | string[] | undefined, resource: string): number {
    if (!value || typeof value !== 'string') throw new AppError(400, `${resource} ID is required`);
    const id = Number(value);
    if (!Number.isInteger(id)) throw new AppError(400, `Invalid ${resource.toLowerCase()} ID`);
    return id;
  }
}
