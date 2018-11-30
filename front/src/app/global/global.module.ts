import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmComponent } from './components/confirm/confirm.component';
import { MessageComponent } from './components/message/message.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { MainComponent } from './components/main/main.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SidenavListComponent } from './components/sidenav-list/sidenav-list.component';

import { Nl2brPipe } from './pipes/nl2br.pipe';
import { OrderByPipe } from './pipes/orderby.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatToolbarModule,
    MatSidenavModule,
    RouterModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    RouterModule,
    TranslateModule,
    BreadcrumbComponent,
    ConfirmComponent,
    MessageComponent,
    MainComponent,
    LoadingComponent,
    PageNotFoundComponent,
    Nl2brPipe,
    OrderByPipe,
    SafeUrlPipe,
    TruncatePipe
  ],
  declarations: [
    BreadcrumbComponent,
    ConfirmComponent,
    MessageComponent,
    MainComponent,
    LoadingComponent,
    PageNotFoundComponent,
    Nl2brPipe,
    OrderByPipe,
    SafeUrlPipe,
    TruncatePipe,
    SidenavListComponent
  ],
  entryComponents: [
    ConfirmComponent,
    MessageComponent,
  ],
})
export class GlobalModule {}
