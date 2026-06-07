import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { Vacancy } from './vacancy.entity';

@ApiTags('vacancies')
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vacancy' })
  @ApiResponse({ status: 201, type: Vacancy })
  create(@Body() dto: CreateVacancyDto): Promise<Vacancy> {
    return this.vacanciesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vacancies' })
  @ApiResponse({ status: 200, type: [Vacancy] })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Vacancy[]> {
    return this.vacanciesService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vacancy by ID' })
  @ApiResponse({ status: 200, type: Vacancy })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Vacancy> {
    return this.vacanciesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vacancy' })
  @ApiResponse({ status: 200, type: Vacancy })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVacancyDto,
  ): Promise<Vacancy> {
    return this.vacanciesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete vacancy' })
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.vacanciesService.remove(id);
  }
}
