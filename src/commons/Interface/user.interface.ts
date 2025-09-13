// Models
import { ROLES } from '../models';

export class IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: ROLES;
  otpCode?: string;
}
