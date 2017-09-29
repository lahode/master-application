import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { User } from '../user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private returnUrl: string;
  private showBlock = 'login';
  private storeUserSubscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<any>) {}

  ngOnInit() {
    // Get url redirection
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Check if user is already authenticated and redirect to returnUrl page
    this.storeUserSubscription = this.store.select(state => state.currentUser).subscribe(user => {
      if (user) {
        this.router.navigate([this.returnUrl]);
      }
    });
  }

  // Change block
  public onChangeBlock(block) {
    this.showBlock = block;
  }

  // Destroy store subscription when leaving component
  ngOnDestroy() {
    this.storeUserSubscription.unsubscribe();
  }

}
