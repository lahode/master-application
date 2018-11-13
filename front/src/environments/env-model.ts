export interface IEnvironment {
  production: boolean;
  homepage: string;
  authentication: {
    type: string,
    value: {}
  };
  socket: {};
}
