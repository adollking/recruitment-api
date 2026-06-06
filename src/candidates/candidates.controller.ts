import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { Candidate } from './candidate.entity';

@ApiTags('candidates')
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new candidate' })
  @ApiResponse({ status: 201, description: 'Candidate created', type: Candidate })
  create(@Body() dto: CreateCandidateDto): Promise<Candidate> {
    return this.candidatesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all candidates' })
  @ApiResponse({ status: 200, description: 'List of candidates', type: [Candidate] })
  findAll(): Promise<Candidate[]> {
    return this.candidatesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get candidate by ID' })
  @ApiResponse({ status: 200, type: Candidate })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Candidate> {
    return this.candidatesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update candidate' })
  @ApiResponse({ status: 200, type: Candidate })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCandidateDto,
  ): Promise<Candidate> {
    return this.candidatesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete candidate' })
  @ApiResponse({ status: 204, description: 'Candidate deleted' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.candidatesService.remove(id);
  }
}
