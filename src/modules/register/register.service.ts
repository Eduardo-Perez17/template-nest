import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Utils
import { ErrorManager } from 'src/commons/utils';

// Dto's
import { CreateRegisterDto } from './dto';

// Entities
import { Register } from './entities/register.entity';

// Services
import { UserService } from '../users/user.service';

// Interfaces
import { IUserAuth } from '../../commons/Interface';
import { UpdateRegisterDto } from './dto/updateRegister.dto';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(Register)
    private registerRepository: Repository<Register>,
    private usersServices: UserService,
  ) {}

  async createRegister({
    body,
    me,
  }: {
    body: CreateRegisterDto;
    me: IUserAuth;
  }): Promise<Register> {
    try {
      const user = await this.usersServices.getUserById({ id: me.sub });
      const newRegister = this.registerRepository.create({ ...body, user });

      await this.registerRepository.save(newRegister);

      return newRegister;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getAllRegisters(): Promise<{ data: Register[]; count: number }> {
    try {
      const data = await this.registerRepository.find();
      return {
        data,
        count: data.length,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getIdRegister({ id }: { id: string }): Promise<Register> {
    try {
      const register = await this.registerRepository.findOneBy({ id });

      if (!register) {
        throw new ErrorManager({
          type: HttpStatus.NOT_FOUND,
          message: `Register with id ${id} was not found`,
        });
      }

      return register;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async editRegister({
    id,
    body,
  }: {
    id: string;
    body: UpdateRegisterDto;
  }): Promise<Register> {
    try {
      if (!Object.values(body).length) {
        throw new ErrorManager({
          type: HttpStatus.BAD_REQUEST,
          message: 'To edit a register you need to send a body',
        });
      }

      const register = await this.getIdRegister({ id });
      await this.registerRepository.update(id, register);

      return register;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async deleteRegister({ id }: { id: string }): Promise<Register> {
    try {
      const register = await this.getIdRegister({ id });
      await this.registerRepository.softDelete(id);

      return register;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
