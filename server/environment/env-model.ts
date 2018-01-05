export interface IEnvironment {
  environmentName: string,
  SECRET_TOKEN_KEY: string,
  BCRYPT_ROUND: number,
  PASSWORD_MIN_LENGHT: number,
  JWT_EXPIRE: number,
  DATABASE: any,
  FRONTEND: string,
  UPLOAD_DIRECTORY: string;
  PORT: number,
  HTTPS: boolean,
  MAILER: any
}
