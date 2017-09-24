import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from "../user.model";
/* import { AuthService } from "../auth.service"; */
import { MessageService } from '../../message/message.service';

@Component({
  selector: 'ob-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private registerForm: FormGroup;
  private loading;
  @Input() returnUrl: string;

  constructor(/* private authService: AuthService, */
              private router: Router,
              private messageService: MessageService) { }

  ngOnInit() {
    // Define email validation pattern
    let emailpattern = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

    // Register form
    this.registerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      username: new FormControl(null, [
        Validators.required
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(emailpattern)
      ]),
      emailconfirm: new FormControl(null, [
        Validators.required,
        Validators.pattern(emailpattern)
      ]),
      password: new FormControl(null, Validators.required)
    });
  }

  // Register the new user
  onRegister() {
    this.loading = true;
    const user = new User(this.registerForm.value.username, this.registerForm.value.password,
                          this.registerForm.value.name, this.registerForm.value.email);
    /*
    this.authService.register(user)
      .subscribe(
        () => this.router.navigate(['/login']),
        err => {
          this.messageService.error(err);
          this.loading = false;
        }
      );
    */
    this.registerForm.reset();
  }

}
