// Models
import { STATE_TYPE } from '../models';

// Entities
import { User } from '../../modules/users/entities/user.entity';

export class IRegister {
  name: string;
  amount: number;
  date: Date;
  stateType: STATE_TYPE;
  user: User;
}
