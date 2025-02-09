import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// Services
import { UserService } from '../../../users/user.service';

// Entity
import { User } from '../../../users/entities/user.entity';

// Models
import { PayloadToken } from '../../models/token.model';

// Interfaces
import { IAuthLogin } from 'src/commons/Interface';
import { ErrorManager } from 'src/commons/utils/error.manager';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: IAuthLogin) {
    try {
      const user = await this.usersService.findByEmail({ email });

      if (!user)
        throw new ErrorManager({
          type: HttpStatus.FORBIDDEN,
          message: 'Email or password are incorrect',
        });

      const isMatch = await bcrypt.compare(password, user.password);

      if (user && isMatch) {
        return this.generateJwt({ user });
      }

      throw new ErrorManager({
        type: HttpStatus.CONFLICT,
        message: 'Email or password are incorrect',
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  generateJwt({ user }: { user: User }) {
    const payload: PayloadToken = {
      role: user.role,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
