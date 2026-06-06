import { Injectable } from '@nestjs/common';
import { Candidate } from '../../candidates/candidate.entity';
import { AgeCriteria } from '../../vacancies/criteria/age-criteria.entity';
import { CriteriaEvaluator } from '../interfaces/criteria-evaluator.interface';

@Injectable()
export class AgeEvaluator implements CriteriaEvaluator<AgeCriteria> {
  readonly type = 'age';

  evaluate(candidate: Candidate, criteria: AgeCriteria): boolean {
    const today = new Date();
    const birth = new Date(candidate.dateOfBirth);
    const age = Math.floor(
      (today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
    );
    return age >= criteria.minAge && age <= criteria.maxAge;
  }
}
