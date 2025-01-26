import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

// Commons
import { STATE_TYPE } from 'src/commons/models';

export class CreateRegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  date: Date;

  @IsNotEmpty()
  @IsEnum(STATE_TYPE)
  stateType: STATE_TYPE;
}

export class ResponseCreateRegisterDto {
  id: number;
  name: string;
  amount: number;
  total: number;
  date: Date;
  stateType: STATE_TYPE;
  deleteAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
