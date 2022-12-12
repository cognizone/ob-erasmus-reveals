import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedbackRequest } from '../models';
import { randomDelay } from '../utils';

@Injectable({ providedIn: 'root' })
export class EmailService {
  sendFeedbackRequest(request: FeedbackRequest): Observable<unknown> {
    // TODO implement me
    console.log('SENDING EMAIL');
    return randomDelay(null);
  }
}
