import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Router} from '@angular/router';
import { Store } from '@ngrx/store';

// import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'ob-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private isLoggedIn$: Observable<boolean>;

  constructor(private translate: TranslateService,
              private store: Store<any>,
              private router: Router) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit() {
    this.isLoggedIn$ = this.store.select(state => state.currentUser).map(user => {console.log(user); return user !== null})
  }

  logout() {
    this.store.dispatch({type: 'LOGOUT'});
  }

}
