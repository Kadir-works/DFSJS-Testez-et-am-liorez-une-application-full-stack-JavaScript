import { AppError } from '../errors/app-error';
import { TeacherRepository } from '../repositories/teacher.repository';

export class TeacherService {
  constructor(private readonly teacherRepository = new TeacherRepository()) {}

  getAll() {
    return this.teacherRepository.findAll();
  }

  async getById(id: number) {
    const teacher = await this.teacherRepository.findById(id);
    if (!teacher) throw new AppError(404, 'Teacher not found');
    return teacher;
  }
}