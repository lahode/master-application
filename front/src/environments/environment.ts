// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { IEnvironment } from './env-model';

export const environment: IEnvironment = {
  production: false,
  authentication: {
    type: 'token',
    value : ''
    /*
    value : {
      api: {
        host: 'http://localhost:3999',
        token: 'oauth/token',
        key: 'simple_auth',
        withCredentials: true,
        tokens: {
          access: 'access_token',
          refresh: 'refresh_token'
        }
      },
      auth: {
        grant_type: 'password',
        client_id: 'd22f88f4-2e87-413b-ab2c-c74c9001f126',
        client_secret: 'front-angular'
      }
    }
    */
  },
  socket: {
    baseUrl: '',
    config: {}
  }
};
