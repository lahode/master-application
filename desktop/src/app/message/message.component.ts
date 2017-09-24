import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { MessageService } from './message.service';
import { Message } from './message';

@Component({
  selector: 'ob-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  messages$: Observable<Message[]> = Observable.of([]);

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messages$ = this.messageService.messages$;
  }

  close() {
    this.messageService.error();
  }

}
