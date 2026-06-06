import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';
import { Gender } from '../candidate.entity';

export class CreateCandidateDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1995-06-15', description: 'ISO 8601 date string' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 8000000, description: 'Current salary in IDR' })
  @IsNumber()
  @Min(0)
  currentSalary: number;
}
