import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  TableInheritance,
  JoinColumn,
} from 'typeorm';
import { Vacancy } from '../vacancy.entity';

@Entity('criteria')
@TableInheritance({ column: { type: 'varchar', name: 'criteria_type' } })
export class Criteria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 1 })
  weightScore: number;

  @Column({ name: 'criteria_type', nullable: true })
  criteriaType: string;

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.criteria, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vacancy_id' })
  vacancy: Vacancy;

  @Column({ name: 'vacancy_id', nullable: true })
  vacancyId: string;
}
