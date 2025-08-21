import { Organization } from '@prisma/client';
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

  organization: Organization;

  worker: {
    worker_id: number;
    role: string;
    attached_types: {
      id: number;
    }[];
  };
}
