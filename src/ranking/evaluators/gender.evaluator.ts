import { Injectable } from '@nestjs/common';
import { Candidate } from '../../candidates/candidate.entity';
import { GenderCriteria, GenderOption } from '../../vacancies/criteria/gender-criteria.entity';
import { CriteriaEvaluator } from '../interfaces/criteria-evaluator.interface';

@Injectable()
export class GenderEvaluator implements CriteriaEvaluator<GenderCriteria> {
  readonly type = 'gender';

  evaluate(candidate: Candidate, criteria: GenderCriteria): boolean {
    if (criteria.gender === GenderOption.ANY) return true;
    return (candidate.gender as string) === (criteria.gender as string);
  }
}
