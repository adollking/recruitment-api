import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GenderOption } from '../criteria/gender-criteria.entity';

export class CriteriaDto {
  @ApiProperty({ enum: ['age', 'gender', 'salary'] })
  @IsEnum(['age', 'gender', 'salary'])
  type: 'age' | 'gender' | 'salary';

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  weightScore?: number;

  @ApiPropertyOptional({ description: 'Required for type=age' })
  @ValidateIf((o) => o.type === 'age')
  @IsInt()
  @Min(0)
  minAge?: number;

  @ApiPropertyOptional({ description: 'Required for type=age' })
  @ValidateIf((o) => o.type === 'age')
  @IsInt()
  @Min(0)
  maxAge?: number;

  @ApiPropertyOptional({ enum: GenderOption, description: 'Required for type=gender' })
  @ValidateIf((o) => o.type === 'gender')
  @IsEnum(GenderOption)
  gender?: GenderOption;

  @ApiPropertyOptional({ description: 'Required for type=salary' })
  @ValidateIf((o) => o.type === 'salary')
  @IsNumber()
  @Min(0)
  minSalary?: number;

  @ApiPropertyOptional({ description: 'Required for type=salary' })
  @ValidateIf((o) => o.type === 'salary')
  @IsNumber()
  @Min(0)
  maxSalary?: number;
}

export class CreateVacancyDto {
  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: [CriteriaDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CriteriaDto)
  criteria: CriteriaDto[];
}
