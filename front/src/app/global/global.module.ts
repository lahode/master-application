import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule,  MatToolbarModule, MatMenuModule, MatIconModule } from '@angular/material';

import { ConfirmComponent } from './components/confirm/confirm.component';
import { ErrorComponent } from './components/error/error.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { GetkeyPipe } from './pipes/getkey.pipe';
import { OrderByPipe } from './pipes/orderby.pipe';
import { ObjtoarrayPipe } from './pipes/objtoarray.pipe';
import { Nl2brPipe } from './pipes/nl2br.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    RouterModule,
    TranslateModule
  ],
  exports: [
    BreadcrumbComponent,
    CommonModule,
    ConfirmComponent,
    ErrorComponent,
    HeaderComponent,
    LoadingComponent,
    PageNotFoundComponent,
    CommonModule,
    GetkeyPipe,
    OrderByPipe,
    ObjtoarrayPipe,
    Nl2brPipe
  ],
  declarations: [
    BreadcrumbComponent,
    ConfirmComponent,
    ErrorComponent,
    HeaderComponent,
    LoadingComponent,
    PageNotFoundComponent,
    GetkeyPipe,
    OrderByPipe,
    ObjtoarrayPipe,
    Nl2brPipe
  ],
  entryComponents: [
    ErrorComponent,
    ConfirmComponent,
  ],
})
export class GlobalModule {}
