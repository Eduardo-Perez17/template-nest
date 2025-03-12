import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// DTO'S
import { ChangeUserPasswordBodyDto, CreateUserDto, UpdateUserDto } from './dto';

// Entity
import { User } from './entities/user.entity';

// Utils
import { ErrorManager, errorManagerParamCharacter } from 'src/commons/utils';

// Constants
import { REJEXT_PASSWORD, REJEXT_USER_NAME } from 'src/commons/constants';

// Interface
import { IUserAuth } from 'src/commons/Interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    try {
      const user = await this.findUser({ user: data.email });
      const userName = await this.findUserName({ userName: data.userName });

      if (!REJEXT_USER_NAME.test(data.userName)) {
        throw new ErrorManager({
          type: HttpStatus.CONFLICT,
          message: 'Username must be between 4 and 16 characters, and can only contain letters, numbers, and underscores.',
        });
      }

      if (user || userName) {
        throw new ErrorManager({
          type: HttpStatus.CONFLICT,
          message: 'The email or userName already exists',
        });
      }

      this.validateUserPassword({ password: data.password });
      data.role.toLowerCase();

      const newUser = this.usersRepository.create(data);
      const savedUser = await this.usersRepository.save(newUser);

      return savedUser;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async changePassword({
    body,
    me,
  }: {
    body: ChangeUserPasswordBodyDto;
    me: IUserAuth;
  }): Promise<User> {
    try {
      const userRequest = await this.getUserById({ id: me?.sub });

      if (userRequest.otpCode === body.otpCode) {
        this.validateUserPassword({ password: body.password });
        const newPassword = await bcrypt.hash(body.password, 10);

        const user = await this.getUserById({ id: me.sub });
        const updateUser = Object.assign(user, {
          password: newPassword,
        });

        await this.usersRepository.update(me.sub, updateUser);
        return updateUser;
      } else {
        throw new ErrorManager({
          type: HttpStatus.CONFLICT,
          message:
            'The OTP code is not compatible with the code sent in the request',
        });
      }
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getUserById({ id }: { id: string }): Promise<User> {
    try {
      errorManagerParamCharacter({ id });
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new ErrorManager({
          type: HttpStatus.NOT_FOUND,
          message: `User with id ${id} was not found`,
        });
      }

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async editUser({
    id,
    body,
  }: {
    id: string;
    body: UpdateUserDto;
  }): Promise<User> {
    try {
      if (!Object.values(body).length) {
        throw new ErrorManager({
          type: HttpStatus.BAD_REQUEST,
          message: 'To edit a user you need to send a body',
        });
      }

      const user = await this.getUserById({ id });

      const updateUser = Object.assign(user, body);
      await this.usersRepository.update(id, updateUser);

      return updateUser;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async deleteUser({ id }: { id: string }): Promise<User> {
    try {
      const user = await this.getUserById({ id });

      await this.usersRepository.softDelete(id);

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  findByEmail({ email }: { email: string }): Promise<User> {
    try {
      return this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findUser({ user }: { user: string }) {
    try {
      const validation = user.includes('@')
        ? { email: user }
        : { userName: user };

      const userFound = await this.usersRepository.findOne({
        where: validation,
      });

      return userFound;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findUserName({ userName }: { userName: string }): Promise<User> {
    try {
      return await this.usersRepository.findOneBy({ userName });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  private validateUserPassword({ password }: { password: string }): void {
    if (!REJEXT_PASSWORD.test(password)) {
      throw new ErrorManager({
        type: HttpStatus.BAD_REQUEST,
        message: `The password must have the following requirements: minimum 8 characters, 1 capital letter, 1 minuscule, 1 special character`,
      });
    }
  }
}
