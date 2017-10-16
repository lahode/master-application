import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Store, Action } from '@ngrx/store'

import { AuthActions } from '../../core';
import { User } from '../../models/user.model';

@IonicPage({
  name: 'LoginPage',
  segment: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

  public loginBtn:boolean = true;
  public pswRecover:boolean = false;
  public registerForm:any;
  public passwordForm:any;
  public signInform:any;
  public loader:any;
  public errorMessage:any;

  constructor(
    public navCtrl: NavController,
    private _formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadCtrl:LoadingController,
    private store: Store<any>,
    private authActions: AuthActions
  ) {
    // Define email validation pattern
    let emailpattern = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

    // Register form
    this.registerForm = this._formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailpattern)])],
      emailconfirm: ['', Validators.compose([Validators.required, Validators.pattern(emailpattern)])],
      password: ['', Validators.compose([Validators.required])]
    });

    this.signInform = this._formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });

    // Password request form
    this.passwordForm = this._formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailpattern)])],
    });
  }

  onLogin(){
    if (this.signInform.valid) {
      this.store.dispatch(<Action>this.authActions.login(this.signInform.value));
      this.signInform.reset();
    }
  }
  onSignup(){
    if (this.registerForm.valid) {
      const newUser = new User(this.registerForm.value.username, this.registerForm.value.password,
                            this.registerForm.value.name, this.registerForm.value.email);
      this.store.dispatch(<Action>this.authActions.signup(newUser));
      this.registerForm.reset();
    }
  }

  // Request a new password
  onRequestPassword() {
    if (this.passwordForm.valid) {
      this.store.dispatch(<Action>this.authActions.getPassword(this.passwordForm.value));
      this.passwordForm.reset();
    }
    this.pswRecover = false;
  }

  toggleBtn(){
    this.loginBtn = !this.loginBtn
  }

  showPasswordRecovery() {
    this.pswRecover = !this.pswRecover;
  }

  /* ErrorHandler Methode */
  showError(text:string,hideLoading:boolean=true):void {
    if (hideLoading === true){
      setTimeout(() => {
        this.loader.dismiss();
      });
    }
    let alert = this.alertCtrl.create({
      title: 'Erreur',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
}
