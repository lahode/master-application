import { devVariables } from '../environment/development';
import { prodVariables } from '../environment/production';

declare const process: any; // Typescript compiler will complain without this

function environmentConfig():any {
  let env = devVariables;
  if(process.env.NODE_ENV === 'production') {
    env = prodVariables
  }
  return env;
}

export const CONFIG = environmentConfig();
