import { Response } from 'express';
import { AppError } from '../errors/app-error';
import { CreateSessionSchema, UpdateSessionSchema } from '../dto/session.dto';
import { AuthRequest } from '../middleware/auth.middleware';
import { SessionService } from '../services/session.service';

export class SessionController {
  constructor(private readonly sessionService = new SessionService()) {}

  async getAll(_req: AuthRequest, res: Response): Promise<void> {
    res.status(200).json(await this.sessionService.getAll());
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    res.status(200).json(await this.sessionService.getById(this.parseId(req.params.id, 'Session')));
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    const result = CreateSessionSchema.safeParse(req.body);
    if (!result.success) throw new AppError(400, 'Invalid session data');
    res.status(201).json(await this.sessionService.create(req.userId, result.data));
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    const result = UpdateSessionSchema.safeParse(req.body);
    if (!result.success) throw new AppError(400, 'Invalid session data');
    res.status(200).json(await this.sessionService.update(req.userId, this.parseId(req.params.id, 'Session'), result.data));
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    await this.sessionService.delete(req.userId, this.parseId(req.params.id, 'Session'));
    res.status(200).json({ message: 'Session deleted successfully' });
  }

  async participate(req: AuthRequest, res: Response): Promise<void> {
    await this.sessionService.participate(
      this.parseId(req.params.id, 'Session'),
      this.parseId(req.params.userId, 'User'),
    );
    res.status(200).json({ message: 'Successfully joined the session' });
  }

  async unparticipate(req: AuthRequest, res: Response): Promise<void> {
    await this.sessionService.unparticipate(
      this.parseId(req.params.id, 'Session'),
      this.parseId(req.params.userId, 'User'),
    );
    res.status(200).json({ message: 'Successfully left the session' });
  }

  private parseId(value: string | string[] | undefined, resource: string): number {
    if (!value || typeof value !== 'string') throw new AppError(400, `${resource} ID is required`);
    const id = Number(value);
    if (!Number.isInteger(id)) throw new AppError(400, `Invalid ${resource.toLowerCase()} ID`);
    return id;
  }
}
