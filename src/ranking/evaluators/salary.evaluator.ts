import { Injectable } from '@nestjs/common';
import { Candidate } from '../../candidates/candidate.entity';
import { SalaryCriteria } from '../../vacancies/criteria/salary-criteria.entity';
import { CriteriaEvaluator } from '../interfaces/criteria-evaluator.interface';

@Injectable()
export class SalaryEvaluator implements CriteriaEvaluator<SalaryCriteria> {
  readonly type = 'salary';

  evaluate(candidate: Candidate, criteria: SalaryCriteria): boolean {
    return (
      candidate.currentSalary >= criteria.minSalary &&
      candidate.currentSalary <= criteria.maxSalary
    );
  }
}
