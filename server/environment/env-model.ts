export interface IEnvironment {
  environmentName: string,
  APPNAME: string,
  DATABASE: any,
  LOGNAME: string,
  FRONTEND: string,
  UPLOAD_DIRECTORY: string;
  PORT: number,
  SOCKET_ACTIVE: boolean,
  SECURITY: any,
  AUTH: any,
  MAILER: any
}
