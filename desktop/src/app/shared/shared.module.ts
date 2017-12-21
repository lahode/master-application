import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetkeyPipe } from './getkey.pipe';
import { OrderByPipe } from './orderby.pipe';
import { ObjtoarrayPipe } from './objtoarray.pipe';
import { Nl2brPipe } from './nl2br.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    GetkeyPipe,
    OrderByPipe,
    ObjtoarrayPipe,
    Nl2brPipe
  ],
  declarations: [
    GetkeyPipe,
    OrderByPipe,
    ObjtoarrayPipe,
    Nl2brPipe
  ]
})
export class SharedModule {}
