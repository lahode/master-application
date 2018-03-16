import { IEnvironment } from './env-model';

export const environment: IEnvironment = {
  production: true,
  authentication: {
    type: 'token',
    value : {}
  },
  socket: {
    baseUrl: '',
    config: {}
  }
};
