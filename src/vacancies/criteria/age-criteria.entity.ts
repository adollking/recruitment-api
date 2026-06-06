import { ChildEntity, Column } from 'typeorm';
import { Criteria } from './criteria.entity';

@ChildEntity('age')
export class AgeCriteria extends Criteria {
  @Column({ nullable: true })
  minAge: number;

  @Column({ nullable: true })
  maxAge: number;
}
