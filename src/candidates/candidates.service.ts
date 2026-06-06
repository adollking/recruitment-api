import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Injectable()
export class CandidatesService {
  private readonly logger = new Logger(CandidatesService.name);

  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,
  ) {}

  async create(dto: CreateCandidateDto): Promise<Candidate> {
    const existing = await this.candidateRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException(`Email ${dto.email} already registered`);
    }

    const candidate = this.candidateRepo.create(dto);
    const saved = await this.candidateRepo.save(candidate);
    this.logger.log(`Created candidate: ${saved.id} (${saved.email})`);
    return saved;
  }

  async findAll(): Promise<Candidate[]> {
    return this.candidateRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Candidate> {
    const candidate = await this.candidateRepo.findOne({ where: { id } });
    if (!candidate) {
      throw new NotFoundException(`Candidate ${id} not found`);
    }
    return candidate;
  }

  async update(id: string, dto: UpdateCandidateDto): Promise<Candidate> {
    const candidate = await this.findOne(id);

    if (dto.email && dto.email !== candidate.email) {
      const existing = await this.candidateRepo.findOne({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException(`Email ${dto.email} already registered`);
      }
    }

    Object.assign(candidate, dto);
    const updated = await this.candidateRepo.save(candidate);
    this.logger.log(`Updated candidate: ${updated.id}`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const candidate = await this.findOne(id);
    await this.candidateRepo.remove(candidate);
    this.logger.log(`Deleted candidate: ${id}`);
  }
}
