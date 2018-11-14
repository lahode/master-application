import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule, MatSelectModule,  MatToolbarModule, MatMenuModule, MatIconModule } from '@angular/material';

import { ConfirmComponent } from './components/confirm/confirm.component';
import { MessageComponent } from './components/message/message.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { OrderByPipe } from './pipes/orderby.pipe';
import { Nl2brPipe } from './pipes/nl2br.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
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
    MessageComponent,
    HeaderComponent,
    LoadingComponent,
    PageNotFoundComponent,
    CommonModule,
    OrderByPipe,
    Nl2brPipe,
    SafeUrlPipe
  ],
  declarations: [
    BreadcrumbComponent,
    ConfirmComponent,
    MessageComponent,
    HeaderComponent,
    LoadingComponent,
    PageNotFoundComponent,
    OrderByPipe,
    Nl2brPipe,
    SafeUrlPipe
  ],
  entryComponents: [
    MessageComponent,
    ConfirmComponent,
  ],
})
export class GlobalModule {}
