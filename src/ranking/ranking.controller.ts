import { Controller, Get, Param, ParseUUIDPipe, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RankingService, RankedCandidate } from './ranking.service';

@ApiTags('ranking')
@Controller('vacancies/:vacancyId/ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  @ApiOperation({
    summary: 'Rank candidates for a vacancy',
    description:
      'Returns all candidates ranked by total weight score of fulfilled criteria. Ties broken alphabetically by name.',
  })
  @ApiResponse({ status: 200, description: 'Ranked list of candidates' })
  rank(@Param('vacancyId', ParseUUIDPipe) vacancyId: string): Promise<RankedCandidate[]> {
    return this.rankingService.rank(vacancyId);
  }

  @Delete('cache')
  @ApiOperation({ summary: 'Invalidate ranking cache for a vacancy' })
  @ApiResponse({ status: 200 })
  async invalidateCache(
    @Param('vacancyId', ParseUUIDPipe) vacancyId: string,
  ): Promise<{ message: string }> {
    await this.rankingService.invalidateCache(vacancyId);
    return { message: 'Cache invalidated' };
  }
}
