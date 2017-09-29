import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router, NavigationStart, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  loading$: Observable<Boolean>;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loading$ = this.router.events
                      .map(event => event instanceof NavigationStart ||
                                    event instanceof RoutesRecognized);
  }

}
