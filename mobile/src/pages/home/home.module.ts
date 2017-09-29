import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { HeaderContentComponentModule } from '../../components/header-content/header-content.module';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    HeaderContentComponentModule,
  ],
  exports: [
    HomePage
  ]
})
export class HomePageModule {}
