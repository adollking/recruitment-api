import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Criteria } from '../../vacancies/criteria/criteria.entity';
import { Candidate } from '../../candidates/candidate.entity';
import { CriteriaEvaluator } from '../interfaces/criteria-evaluator.interface';
import { AgeEvaluator } from './age.evaluator';
import { GenderEvaluator } from './gender.evaluator';
import { SalaryEvaluator } from './salary.evaluator';

@Injectable()
export class EvaluatorRegistry implements OnModuleInit {
  private readonly logger = new Logger(EvaluatorRegistry.name);
  private readonly evaluators = new Map<string, CriteriaEvaluator>();

  constructor(
    private readonly ageEvaluator: AgeEvaluator,
    private readonly genderEvaluator: GenderEvaluator,
    private readonly salaryEvaluator: SalaryEvaluator,
  ) {}

  onModuleInit() {
    this.register(this.ageEvaluator);
    this.register(this.genderEvaluator);
    this.register(this.salaryEvaluator);
    this.logger.log(`Registered evaluators: ${[...this.evaluators.keys()].join(', ')}`);
  }

  register(evaluator: CriteriaEvaluator): void {
    this.evaluators.set(evaluator.type, evaluator);
  }

  evaluate(candidate: Candidate, criteria: Criteria): boolean {
    const evaluator = this.evaluators.get((criteria as any).criteriaType);
    if (!evaluator) {
      this.logger.warn(`No evaluator found for criteria type: ${(criteria as any).criteriaType}`);
      return false;
    }
    return evaluator.evaluate(candidate, criteria as any);
  }
}
