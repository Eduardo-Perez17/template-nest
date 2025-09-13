import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Interface
import { IUserAuth } from '../../../src/commons/Interface';

// Entities
import { User } from '../users/entities/user.entity';

// Utils
import { ErrorManager } from '../../commons/utils';

// Dto's
import { ChangeUserPasswordBodyDto } from './dto';

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
        },
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

  async updateMe({
    me,
    body,
  }: {
    me: IUserAuth;
    body: Partial<User>;
  }): Promise<User> {
    try {
      await this.usersRepository.update({ id: me.sub }, body);

      return await this.getMe({ me });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async changePasswordMe({
    me,
    body,
  }: {
    me: IUserAuth;
    body: ChangeUserPasswordBodyDto;
  }): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: me.sub, email: body.email },
      });

      if (!user) {
        throw new ErrorManager({
          type: HttpStatus.NOT_FOUND,
          message: `User not found or not authorized`,
        });
      }

      const isMatch = await bcrypt.compare(body.currentPassword, user.password);
      if (!isMatch) {
        throw new ErrorManager({
          type: HttpStatus.BAD_REQUEST,
          message: `Current password is incorrect`,
        });
      }

      user.password = await bcrypt.hash(body.newPassword, 10);
      await this.usersRepository.save(user);

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
