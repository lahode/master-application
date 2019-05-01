import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent implements OnInit {

  breadcrumb$: Observable<any>;

  constructor(private readonly _store: Store<any>) { }

  ngOnInit() {
    this.breadcrumb$ = this._store.select(state => state.breadcrumb);
  }

}
