import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedbackRequest } from '../models';
import { I18nService } from '@cognizone/i18n';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EmailService {
  constructor(private i18nService: I18nService, private http: HttpClient) {}
  sendFeedbackRequest(request: FeedbackRequest): Observable<string> {
    const body = {
      '@id': request['@id'],
      message: request.message,
      language: this.i18nService.getActiveLang(),
      emails: request.emails,
      user: {
        firstName: request['@facets']?.firstName,
        lastName: request['@facets']?.lastName,
        email: request['@facets']?.email,
        country: request['@facets']?.country
      }
    };
    return this.http.post('api/feedback', body) as Observable<string>;
  }
}
