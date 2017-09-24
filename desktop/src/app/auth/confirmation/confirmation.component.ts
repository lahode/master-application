import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

/* import { AuthService } from "../auth.service"; */
import { MessageService } from '../../message/message.service';

@Component({
  selector: 'ob-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  private confirmationForm: FormGroup;
  private loading;
  @Output() alertReceived = new EventEmitter();
  @Output() changeBlock = new EventEmitter();

  constructor(/* private authService: AuthService,*/
              private messageService: MessageService) { }

  ngOnInit() {
    // Define email validation pattern
    let emailpattern = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

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
