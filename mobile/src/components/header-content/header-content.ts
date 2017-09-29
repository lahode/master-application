import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'header-content',
  templateUrl: 'header-content.html'
})
export class HeaderContentComponent {

  @Input() title: string;
  @Input() backEnabled: Boolean;
  showBack:Boolean;

  @Output() onBack: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
      this.showBack = this.backEnabled;
  }

  onClickBack(){
    this.onBack.emit({})
  }

}
