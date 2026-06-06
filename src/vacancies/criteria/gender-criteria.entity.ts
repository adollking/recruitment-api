import { ChildEntity, Column } from 'typeorm';
import { Criteria } from './criteria.entity';

export enum GenderOption {
  MALE = 'male',
  FEMALE = 'female',
  ANY = 'any',
}

@ChildEntity('gender')
export class GenderCriteria extends Criteria {
  @Column({ type: 'enum', enum: GenderOption, nullable: true })
  gender: GenderOption;
}
