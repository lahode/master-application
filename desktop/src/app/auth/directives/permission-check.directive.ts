import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store, Action } from '@ngrx/store';

import { AuthActions } from '../store';

@Directive({
  selector: '[appPermCheck]'
})
export class PermissionCheckDirective implements OnInit, OnDestroy {

  permissions: string[];
  isAllowed: boolean;
  sub: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private store: Store<any>) {

    this.sub = this.store.select(state => state)
      .filter((state) => state.loading.length === 0)
      .subscribe((state) => {
        this.isAllowed = state.permissionCheck;
        this.showIfUserAllowed();
      });
  }

  ngOnInit() {
    this.store.dispatch(<Action>AuthActions.checkPermission(this.permissions));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @Input()
  set permissionAllow(allowedPermissions: string[]) {
    this.permissions = allowedPermissions;
    this.showIfUserAllowed();
  }

  showIfUserAllowed() {
    if (this.isAllowed) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
