export interface User {
  _id:number;
  sub:string;
  email:string;
  password:string,
  roles: string[];
}
