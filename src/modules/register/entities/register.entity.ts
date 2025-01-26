import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Commons
import { BaseEntity } from '../../../commons/baseEntity';

// Models
import { STATE_TYPE } from '../../../commons/models';

// Interfaces
import { IRegister } from '../../../commons/Interface';
import { User } from 'src/modules/users/entities/user.entity';

@Entity({ name: 'register' })
export class Register extends BaseEntity implements IRegister {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, default: null })
  name: string;

  @Column({ type: 'float', default: 0.0 })
  amount: number;

  @Column({ type: 'timestamp', default: null })
  date: Date;

  @Column({
    type: 'enum',
    enum: STATE_TYPE,
    default: STATE_TYPE.BILLS,
    name: 'state_type',
  })
  stateType: STATE_TYPE;

  @ManyToOne(() => User, (user) => user.register)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
