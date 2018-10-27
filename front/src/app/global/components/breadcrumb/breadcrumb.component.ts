import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumb$: Observable<any>;

  constructor(private _store: Store<any>) { }

  ngOnInit() {
    this.breadcrumb$ = this._store.select(state => state.breadcrumb);
  }

}
