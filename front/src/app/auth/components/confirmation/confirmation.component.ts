import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  private confirmationForm: FormGroup;
  private loading;
  @Output() alertReceived = new EventEmitter();
  @Output() changeBlock = new EventEmitter();

  ngOnInit() {
    // Define email validation pattern
    const emailpattern = `[a-z0-9!#$%&'*+/=?^_"{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_"{|}~-]+)` +
                         `@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?`;

    // Confirmation request form
    this.confirmationForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(emailpattern)
      ]),
    });
  }

  // Request a new confirmation email
  onRequestConfirmation() {
    this.loading = true;
/*
    this.authService.requestConfirmation(this.confirmationForm.value.email)
      .subscribe(
        data => this.changeBlock.emit('login'),
        err => {
          this.messageService.error(err);
          this.loading = false;
        }
      );
    this.confirmationForm.reset();
    */
  }

}
