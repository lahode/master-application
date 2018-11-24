import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmComponent } from './components/confirm/confirm.component';
import { MessageComponent } from './components/message/message.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { Nl2brPipe } from './pipes/nl2br.pipe';
import { OrderByPipe } from './pipes/orderby.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatToolbarModule,
    RouterModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatToolbarModule,
    RouterModule,
    TranslateModule,
    BreadcrumbComponent,
    ConfirmComponent,
    MessageComponent,
    HeaderComponent,
    LoadingComponent,
    PageNotFoundComponent,
    Nl2brPipe,
    OrderByPipe,
    SafeUrlPipe,
  ],
  declarations: [
    BreadcrumbComponent,
    ConfirmComponent,
    MessageComponent,
    HeaderComponent,
    LoadingComponent,
    PageNotFoundComponent,
    Nl2brPipe,
    OrderByPipe,
    SafeUrlPipe
  ],
  entryComponents: [
    ConfirmComponent,
    MessageComponent,
  ],
})
export class GlobalModule {}
