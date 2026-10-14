import * as bcrypt from 'bcrypt';
import { AppError } from '../errors/app-error';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { UserRepository } from '../repositories/user.repository';
import { generateToken } from '../utils/jwt.util';

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async login({ email, password }: LoginDto) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError(401, 'Invalid credentials');
    }
    return { ...this.toAuthUser(user), token: generateToken(user.id) };
  }

  async register({ email, password, firstName, lastName }: RegisterDto) {
    if (await this.userRepository.findByEmail(email)) {
      throw new AppError(400, 'Email already exists');
    }
    const user = await this.userRepository.create({
      email,
      password: await bcrypt.hash(password, 10),
      firstName,
      lastName,
      admin: false,
    });
    return { ...this.toAuthUser(user), token: generateToken(user.id) };
  }

  private toAuthUser(user: { id: number; email: string; firstName: string; lastName: string; admin: boolean }) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      admin: user.admin,
    };
  }
}