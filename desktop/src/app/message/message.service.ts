import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Message } from './message';

@Injectable()
export class MessageService {

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$: Observable<Message[]> = this.messagesSubject.asObservable();

  error(...errors: string[]) {
    let messages: Message[] = [];
    for (const error of errors) {
      messages.push(new Message(error));
    }
    this.messagesSubject.next(messages);
  }
}
