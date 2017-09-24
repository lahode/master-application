import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../user.model';
/* import { AuthService } from "../auth.service"; */

@Component({
  selector: 'ob-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private returnUrl: string;
  private showBlock: string = 'login';

  constructor(private route: ActivatedRoute,
              /* private authService: AuthService,*/
              private router: Router) {}

  ngOnInit() {
    /*
    // Get url redirection
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return;
    } else {
      this.authService.logout()
    }
    */
  }

  // Change block
  public onChangeBlock(block) {
    this.showBlock = block;
  }

}
