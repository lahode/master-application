import { IEnvironment } from "./env-model";

export const devVariables:IEnvironment = {
  environmentName: 'Development Environment',
  ionicEnvName: 'dev',

  // Back-end
  dbHost: 'mongodb://localhost:27017',
  dbName: 'test'
};
