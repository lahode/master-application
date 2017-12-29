import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
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
    this.storeUserSubscription = this.store.select(state => state).take(1);
    this.storeUserSubscription.subscribe(user => {
      if (user) {
        this.router.navigate([this.returnUrl]);
      }
    });
  }

  // Change block
  public onChangeBlock(block) {
    this.showBlock = block;
  }

}
