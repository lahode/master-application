import { IEnvironment } from "./env-model";

export const devVariables:IEnvironment = {
  environmentName: 'Development Environment',
  ionicEnvName: 'dev',

  // Front-end
  apiEndpoint: 'http://localhost:4300',

  // Back-end
  dbHost: 'mongodb://localhost:27017',
  dbName: 'test'
};
