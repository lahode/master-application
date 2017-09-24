import { InjectionToken } from '@angular/core';
import { IEnvironment } from '../../../environment';

export let EnvVariables = new InjectionToken<IEnvironment>( 'env.variables' );
