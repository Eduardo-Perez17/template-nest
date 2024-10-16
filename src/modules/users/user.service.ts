import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// DTO'S
import { CreateUserDto } from './dto/createUser.dto';

// Entity
import { User } from './entities/user.entity';

// Commons
import { ErrorManager } from 'src/commons/utils/error.manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const user = await this.findByEmail({ email: data.email });

      if (user) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: 'The email already exists',
        });
      }

      const newUser = this.usersRepository.create(data);
      const savedUser = await this.usersRepository.save(newUser);

      return savedUser;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  findByEmail({ email }: { email: string }) {
    return this.usersRepository.findOne({ where: { email } });
  }
}
