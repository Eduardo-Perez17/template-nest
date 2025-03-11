import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Interface
import { IUserAuth } from '../../../src/commons/Interface';

// Entities
import { User } from '../users/entities/user.entity';

// Utils
import { ErrorManager } from '../../commons/utils';

@Injectable()
export class MeService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getMe({ me }: { me: IUserAuth }): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: me.sub,
        }
      });

      if (!user) {
        throw new ErrorManager({
          type: HttpStatus.NOT_FOUND,
          message: `User was not found`,
        });
      }

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
