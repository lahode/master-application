import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

/* import { AuthService } from "../auth.service"; */
import { MessageService } from '../../message/message.service';

@Component({
  selector: 'ob-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  public passwordForm: FormGroup;
  public loading;
  @Output() alertReceived = new EventEmitter();
  @Output() changeBlock = new EventEmitter();

  constructor(/* private authService: AuthService, */
              private messageService: MessageService) { }

  ngOnInit() {
    // Define email validation pattern
    let emailpattern = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

    // Password request form
    this.passwordForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(emailpattern)
      ]),
    });
  }

  // Request a new password
  onRequestPassword() {
    /*
    this.loading = true;
    this.authService.requestPassword(this.passwordForm.value.email)
      .subscribe(
        data => this.changeBlock.emit('login'),
        err => {
          this.messageService.error(err);
          this.loading = false;
        }
      );
    this.passwordForm.reset();
    */
  }

}
