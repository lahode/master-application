export interface IEnvironment {
  environmentName: string,
  APPNAME: string,
  LOGNAME: string,
  FRONTEND: string,
  UPLOAD_DIRECTORY: string;
  PORT: number,
  SOCKET_ACTIVE: boolean,
  REDIS: any,
  SECURITY: any,
  AUTH: any,
  MAILER: any,
  MONGODB: string
}
