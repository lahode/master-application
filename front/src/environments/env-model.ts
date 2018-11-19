export interface IEnvironment {
  production: boolean;
  homepage: string;
  server: string;
  authentication: {
    type: string,
    value: {}
  };
  socket: boolean;
}
