import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    username: string;
    email: string;
    github_id: string;
    avatar: string;
  };
}
