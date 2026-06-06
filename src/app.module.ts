import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CandidatesModule } from './candidates/candidates.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { RankingModule } from './ranking/ranking.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { Candidate } from './candidates/candidate.entity';
import { Vacancy } from './vacancies/vacancy.entity';
import { Criteria } from './vacancies/criteria/criteria.entity';
import { AgeCriteria } from './vacancies/criteria/age-criteria.entity';
import { GenderCriteria } from './vacancies/criteria/gender-criteria.entity';
import { SalaryCriteria } from './vacancies/criteria/salary-criteria.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_DATABASE', 'recruitment_db'),
        entities: [Candidate, Vacancy, Criteria, AgeCriteria, GenderCriteria, SalaryCriteria],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
    CandidatesModule,
    VacanciesModule,
    RankingModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
