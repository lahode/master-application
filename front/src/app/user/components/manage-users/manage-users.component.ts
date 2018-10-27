import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  private showBlock = 'login';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<any>) {}

  ngOnInit() {
  }

  // Change block
  public onChangeBlock(block) {
    this.showBlock = block;
  }

}
