import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Router} from '@angular/router';

// import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'ob-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private isLoggedIn$ : Observable<boolean>;

  constructor(private translate: TranslateService,
              // private authService: AuthService,
              private router: Router) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit() {
    // this.isLoggedIn$ = this.authService.user$.map(user => user !== null)
  }

  logout() {
    // this.authService.logout();
    this.router.navigate(['/signin']);
  }

}
