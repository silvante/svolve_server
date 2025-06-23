import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    username: string;
    email: string;
    avatar: string;
    name: string;
    provider: string;
    provider_id: string;
  };
}
