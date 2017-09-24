import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppStateModule, providers } from './app-state-module';
import { EnvironmentsModule } from './environment/environment.module';
import { AuthGuard } from './services/auth-service/authguard.service';

import { AuthEffects } from './app-state-module/effects/auth.effects';
import { reducer } from './app-state-module/reducers';

export const coreApp = {
  reducer: reducer,
  effect: AuthEffects,
}

@NgModule({
  imports: [
    CommonModule,
    AppStateModule,
    EnvironmentsModule
  ]
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: [providers]
    };
  }
}
