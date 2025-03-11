import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

// Commons
import { BaseEntity } from '../../../commons/baseEntity';

// Models
import { ROLES } from '../../../commons/models';

// Interfaces
import { IUser } from '../../../commons/Interface';

@Entity({ name: 'user' })
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'first_name', default: null })
  firstName: string;

  @Column({ type: 'varchar', length: 255, name: 'last_name', default: null })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true, default: null })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, default: null })
  password: string;

  @Column({ type: 'enum', enum: ROLES, default: ROLES.USER })
  role: string;

  @Column({ type: 'varchar', length: 8, default: null })
  otpCode: string;

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) return;

    this.password = await bcrypt.hash(this.password, 10);
  }
}
