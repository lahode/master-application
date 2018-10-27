import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private showBlock = 'login';

  // Change block
  public onChangeBlock(block) {
    this.showBlock = block;
  }

}
