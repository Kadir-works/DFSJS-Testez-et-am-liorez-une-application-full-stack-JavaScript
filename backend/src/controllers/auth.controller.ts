import { Request, Response } from 'express';
import { AppError } from '../errors/app-error';
import { LoginSchema, RegisterSchema } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  async login(req: Request, res: Response): Promise<void> {
    const result = LoginSchema.safeParse(req.body);
    if (!result.success) throw new AppError(400, 'Invalid login data');
    res.status(200).json(await this.authService.login(result.data));
  }

  async register(req: Request, res: Response): Promise<void> {
    const result = RegisterSchema.safeParse(req.body);
    if (!result.success) throw new AppError(400, 'Invalid registration data');
    res.status(201).json(await this.authService.register(result.data));
  }
}
