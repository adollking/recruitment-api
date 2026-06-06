import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './vacancy.entity';
import { Criteria } from './criteria/criteria.entity';
import { AgeCriteria } from './criteria/age-criteria.entity';
import { GenderCriteria } from './criteria/gender-criteria.entity';
import { SalaryCriteria } from './criteria/salary-criteria.entity';
import { VacanciesService } from './vacancies.service';
import { VacanciesController } from './vacancies.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacancy, Criteria, AgeCriteria, GenderCriteria, SalaryCriteria]),
  ],
  providers: [VacanciesService],
  controllers: [VacanciesController],
  exports: [VacanciesService],
})
export class VacanciesModule {}
