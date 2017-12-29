import {AbstractControl} from '@angular/forms';

export class DoubleValidation {

    static MatchEmail(AC: AbstractControl) {
       const email = AC.get('email').value;
       const emailconfirm = AC.get('emailconfirm').value;
        if (email !== emailconfirm) {
            AC.get('emailconfirm').setErrors({ MatchEmail: true })
        } else {
            return null;
        }
    }

    static MatchPassword(AC: AbstractControl) {
       const password = AC.get('password').value;
       const passwordconfirm = AC.get('passwordconfirm').value;
        if (password !== passwordconfirm) {
            AC.get('passwordconfirm').setErrors({ MatchPassword: true })
        } else {
            return null;
        }
    }

}
