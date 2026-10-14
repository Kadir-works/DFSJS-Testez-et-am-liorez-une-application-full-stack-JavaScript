import { AppError } from '../errors/app-error';
import { CreateSessionDto, UpdateSessionDto } from '../dto/session.dto';
import { SessionRepository } from '../repositories/session.repository';
import { TeacherRepository } from '../repositories/teacher.repository';
import { UserRepository } from '../repositories/user.repository';

export class SessionService {
  constructor(
    private readonly sessionRepository = new SessionRepository(),
    private readonly userRepository = new UserRepository(),
    private readonly teacherRepository = new TeacherRepository(),
  ) {}

  async getAll() {
    const sessions = await this.sessionRepository.findAll();
    return sessions.map((session) => this.toResponse(session));
  }

  async getById(id: number) {
    const session = await this.sessionRepository.findById(id);
    if (!session) throw new AppError(404, 'Session not found');
    return this.toResponse(session);
  }

  async create(userId: number | undefined, data: CreateSessionDto) {
    await this.requireAdmin(userId);
    await this.requireTeacher(data.teacherId);
    const session = await this.sessionRepository.create({
      name: data.name,
      date: new Date(data.date),
      description: data.description,
      teacher: { connect: { id: data.teacherId } },
    });
    return this.toResponse(session);
  }

  async update(userId: number | undefined, id: number, data: UpdateSessionDto) {
    await this.requireAdmin(userId);
    await this.requireSession(id);
    if (data.teacherId !== undefined) await this.requireTeacher(data.teacherId);
    const session = await this.sessionRepository.update(id, {
      ...(data.name === undefined ? {} : { name: data.name }),
      ...(data.date === undefined ? {} : { date: new Date(data.date) }),
      ...(data.description === undefined ? {} : { description: data.description }),
      ...(data.teacherId === undefined ? {} : { teacher: { connect: { id: data.teacherId } } }),
    });
    return this.toResponse(session);
  }

  async delete(userId: number | undefined, id: number): Promise<void> {
    await this.requireAdmin(userId);
    await this.requireSession(id);
    await this.sessionRepository.delete(id);
  }

  async participate(sessionId: number, userId: number): Promise<void> {
    await this.requireSession(sessionId);
    if (!(await this.userRepository.findById(userId))) throw new AppError(404, 'User not found');
    if (await this.sessionRepository.findParticipation(sessionId, userId)) {
      throw new AppError(400, 'User already participating in this session');
    }
    await this.sessionRepository.createParticipation(sessionId, userId);
  }

  async unparticipate(sessionId: number, userId: number): Promise<void> {
    if (!(await this.sessionRepository.findParticipation(sessionId, userId))) {
      throw new AppError(404, 'Participation not found');
    }
    await this.sessionRepository.deleteParticipation(sessionId, userId);
  }

  private async requireAdmin(userId: number | undefined): Promise<void> {
    if (!userId || !(await this.userRepository.findById(userId))?.admin) {
      throw new AppError(403, 'Admin access required');
    }
  }

  private async requireSession(id: number): Promise<void> {
    if (!(await this.sessionRepository.findById(id))) throw new AppError(404, 'Session not found');
  }

  private async requireTeacher(id: number): Promise<void> {
    if (!(await this.teacherRepository.findById(id))) throw new AppError(404, 'Teacher not found');
  }

  private toResponse(session: {
    id: number;
    name: string;
    date: Date;
    description: string;
    teacher: { id: number; firstName: string; lastName: string };
    participants: Array<{ user: { id: number } }>;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: session.id,
      name: session.name,
      date: session.date,
      description: session.description,
      teacher: session.teacher,
      users: session.participants.map((participant) => participant.user.id),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}