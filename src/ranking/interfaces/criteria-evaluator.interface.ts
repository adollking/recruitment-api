import { Candidate } from '../../candidates/candidate.entity';
import { Criteria } from '../../vacancies/criteria/criteria.entity';

export interface CriteriaEvaluator<T extends Criteria = Criteria> {
  readonly type: string;
  evaluate(candidate: Candidate, criteria: T): boolean;
}
