import { devVariables } from '../environment/development';
import { prodVariables } from '../environment/production';
import { IEnvironment } from '../environment/env-model';


declare const process: any; // Typescript compiler will complain without this

function environmentConfig():any {
  let env = devVariables;
  if(process.env.NODE_ENV === 'prod'){env = prodVariables}
  return env;
}

export const CONFIG = environmentConfig();
