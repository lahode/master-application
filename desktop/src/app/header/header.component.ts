import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Router} from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private isLoggedIn$: Observable<boolean>;
  public currentLang = 'en';

  constructor(private translate: TranslateService,
              private store: Store<any>,
              private router: Router) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang(this.currentLang);
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit() {
    this.isLoggedIn$ = this.store.select(state => state.currentUser).map(user => user !== null);
  }

  logout() {
    this.store.dispatch({type: 'LOGOUT'});
  }

  setLanguage(value) {
    this.translate.use(value);
    this.currentLang = value;
  }

}
