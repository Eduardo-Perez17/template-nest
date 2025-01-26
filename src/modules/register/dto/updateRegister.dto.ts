import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

// Commons
import { STATE_TYPE } from '../../../commons/models';

export class UpdateRegisterDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(STATE_TYPE)
  stateType: STATE_TYPE;
}
