export interface IEnvironment {
  environmentName: string,
  DATABASE: any,
  FRONTEND: string,
  UPLOAD_DIRECTORY: string;
  PORT: number,
  SECURITY: any,
  AUTH: {
    type: string;
    value: any;
  }
  MAILER: any
}
