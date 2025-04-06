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

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', length: 100, name: 'user_name', unique: true })
  userName: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'enum', enum: ROLES, default: ROLES.USER })
  role: string;

  @Column({ type: 'varchar', length: 8, default: null, name: 'otp_code' })
  otpCode: string;

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) return;

    this.password = await bcrypt.hash(this.password, 10);
  }
}
