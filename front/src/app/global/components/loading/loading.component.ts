import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, NavigationStart, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  loading$: Observable<Boolean>;

  constructor(private readonly _router: Router) {}

  ngOnInit() {
    this.loading$ = this._router.events
      .pipe(
        map(event => event instanceof NavigationStart || event instanceof RoutesRecognized)
      );
  }

}
