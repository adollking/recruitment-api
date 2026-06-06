import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from '../candidates/candidate.entity';
import { VacanciesModule } from '../vacancies/vacancies.module';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { EvaluatorRegistry } from './evaluators/evaluator-registry.service';
import { AgeEvaluator } from './evaluators/age.evaluator';
import { GenderEvaluator } from './evaluators/gender.evaluator';
import { SalaryEvaluator } from './evaluators/salary.evaluator';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate]), VacanciesModule],
  providers: [
    RankingService,
    EvaluatorRegistry,
    AgeEvaluator,
    GenderEvaluator,
    SalaryEvaluator,
  ],
  controllers: [RankingController],
})
export class RankingModule {}
