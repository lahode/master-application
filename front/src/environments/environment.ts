// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { IEnvironment } from './env-model';

export const environment: IEnvironment = {
  production: false,
  homepage: '/home',
  server: 'http://localhost:4300',
  authentication: {
    type: 'token',
    value : {
      callback: '', // callback URL
      domain: '',  // auth0 domain name
      client_id: ''  // client ID
    }
  },
  socket: false
};
