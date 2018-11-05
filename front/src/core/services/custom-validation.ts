import {AbstractControl} from '@angular/forms';

export class DoubleValidation {

  static MatchEmail(AC: AbstractControl) {
    const email = AC.get('email').value;
    const emailconfirm = AC.get('emailconfirm').value;
    if (email !== emailconfirm) {
      AC.get('emailconfirm').setErrors({ MatchEmail: true });
    } else {
      const control = AC.get('emailconfirm');
      if (control.hasError('MatchEmail')) {
        delete control.errors['MatchEmail'];
        control.updateValueAndValidity();
      }
      return null;
    }
  }

  static MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value;
    const passwordconfirm = AC.get('passwordconfirm').value;
    if (password && password !== passwordconfirm) {
      AC.get('passwordconfirm').setErrors({ MatchPassword: true });
      return null;
    } else {
      const control = AC.get('passwordconfirm');
      if (control.hasError('MatchPassword')) {
        delete control.errors['MatchPassword'];
        control.updateValueAndValidity();
      }
      return null;
    }
  }

}
