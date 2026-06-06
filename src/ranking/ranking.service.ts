import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { Candidate } from '../candidates/candidate.entity';
import { VacanciesService } from '../vacancies/vacancies.service';
import { EvaluatorRegistry } from './evaluators/evaluator-registry.service';

export interface RankedCandidate {
  rank: number;
  score: number;
  candidate: Candidate;
}

@Injectable()
export class RankingService {
  private readonly logger = new Logger(RankingService.name);
  private readonly redis: Redis;
  private readonly cacheTtl: number;

  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,
    private readonly vacanciesService: VacanciesService,
    private readonly evaluatorRegistry: EvaluatorRegistry,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      lazyConnect: true,
    });
    this.cacheTtl = this.configService.get<number>('REDIS_TTL', 300);

    this.redis.on('error', (err) => {
      this.logger.warn(`Redis connection error: ${err.message}`);
    });
  }

  async rank(vacancyId: string): Promise<RankedCandidate[]> {
    const cacheKey = `ranking:${vacancyId}`;

    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for ranking:${vacancyId}`);
        return JSON.parse(cached);
      }
    } catch (err) {
      this.logger.warn(`Redis get failed: ${err.message}`);
    }

    const [vacancy, candidates] = await Promise.all([
      this.vacanciesService.findOne(vacancyId),
      this.candidateRepo.find(),
    ]);

    const scored = candidates.map((candidate) => {
      const score = vacancy.criteria.reduce((total, criteria) => {
        return this.evaluatorRegistry.evaluate(candidate, criteria)
          ? total + criteria.weightScore
          : total;
      }, 0);
      return { candidate, score };
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.candidate.name.localeCompare(b.candidate.name);
    });

    const result: RankedCandidate[] = scored.map((item, index) => ({
      rank: index + 1,
      score: item.score,
      candidate: item.candidate,
    }));

    try {
      await this.redis.set(cacheKey, JSON.stringify(result), 'EX', this.cacheTtl);
      this.logger.debug(`Cached ranking for vacancy:${vacancyId} (TTL: ${this.cacheTtl}s)`);
    } catch (err) {
      this.logger.warn(`Redis set failed: ${err.message}`);
    }

    return result;
  }

  async invalidateCache(vacancyId?: string): Promise<void> {
    try {
      if (vacancyId) {
        await this.redis.del(`ranking:${vacancyId}`);
      } else {
        const keys = await this.redis.keys('ranking:*');
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      }
    } catch (err) {
      this.logger.warn(`Cache invalidation failed: ${err.message}`);
    }
  }
}
