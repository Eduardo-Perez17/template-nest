export class IAuthLogin {
  password: string;
  email?: string;
  user_name?: string;
}

export class PayloadToken {
  role: string;
  sub: string;
}

export class IUserAuth extends PayloadToken {
  iat: number;
  exp: number;
}