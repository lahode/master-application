import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { LoaderService } from '../../../../core/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  public color = 'primary';
  public mode = 'indeterminate';
  public value = 50;
  public isLoading$: Observable<boolean>;

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    this.isLoading$ = this.loaderService.isLoading$.pipe(delay(0));
  }
}
