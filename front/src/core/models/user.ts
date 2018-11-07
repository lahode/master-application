import { Role } from './role';

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  owner: string;
  picture: any;
  description: string;
  roles: any[];
}
