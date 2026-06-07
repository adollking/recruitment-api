import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacancy } from './vacancy.entity';
import { Criteria } from './criteria/criteria.entity';
import { AgeCriteria } from './criteria/age-criteria.entity';
import { GenderCriteria } from './criteria/gender-criteria.entity';
import { SalaryCriteria } from './criteria/salary-criteria.entity';
import { CreateVacancyDto, CriteriaDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

@Injectable()
export class VacanciesService {
  private readonly logger = new Logger(VacanciesService.name);

  constructor(
    @InjectRepository(Vacancy)
    private readonly vacancyRepo: Repository<Vacancy>,
    @InjectRepository(Criteria)
    private readonly criteriaRepo: Repository<Criteria>,
    @InjectRepository(AgeCriteria)
    private readonly ageCriteriaRepo: Repository<AgeCriteria>,
    @InjectRepository(GenderCriteria)
    private readonly genderCriteriaRepo: Repository<GenderCriteria>,
    @InjectRepository(SalaryCriteria)
    private readonly salaryCriteriaRepo: Repository<SalaryCriteria>,
  ) {}

  private buildCriteriaEntity(dto: CriteriaDto, vacancyId: string): Criteria {
    const weight = dto.weightScore ?? 1;
    switch (dto.type) {
      case 'age':
        return this.ageCriteriaRepo.create({
          weightScore: weight,
          minAge: dto.minAge,
          maxAge: dto.maxAge,
          vacancyId,
        });
      case 'gender':
        return this.genderCriteriaRepo.create({
          weightScore: weight,
          gender: dto.gender,
          vacancyId,
        });
      case 'salary':
        return this.salaryCriteriaRepo.create({
          weightScore: weight,
          minSalary: dto.minSalary,
          maxSalary: dto.maxSalary,
          vacancyId,
        });
    }
  }

  async create(dto: CreateVacancyDto): Promise<Vacancy> {
    const vacancy = this.vacancyRepo.create({ name: dto.name });
    const savedVacancy = await this.vacancyRepo.save(vacancy);

    const criteriaEntities = dto.criteria.map((c) =>
      this.buildCriteriaEntity(c, savedVacancy.id),
    );
    await this.criteriaRepo.save(criteriaEntities);

    this.logger.log(`Created vacancy: ${savedVacancy.id} (${savedVacancy.name})`);
    return this.findOne(savedVacancy.id);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Vacancy[]> {
    return this.vacancyRepo.find({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Vacancy> {
    const vacancy = await this.vacancyRepo.findOne({ where: { id } });
    if (!vacancy) {
      throw new NotFoundException(`Vacancy ${id} not found`);
    }
    return vacancy;
  }

  async update(id: string, dto: UpdateVacancyDto): Promise<Vacancy> {
    const vacancy = await this.findOne(id);

    if (dto.name) {
      vacancy.name = dto.name;
    }

    if (dto.criteria) {
      await this.criteriaRepo.delete({ vacancyId: id });
      const criteriaEntities = dto.criteria.map((c) =>
        this.buildCriteriaEntity(c, id),
      );
      await this.criteriaRepo.save(criteriaEntities);
    }

    await this.vacancyRepo.save(vacancy);
    this.logger.log(`Updated vacancy: ${id}`);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const vacancy = await this.findOne(id);
    await this.vacancyRepo.remove(vacancy);
    this.logger.log(`Deleted vacancy: ${id}`);
  }
}
