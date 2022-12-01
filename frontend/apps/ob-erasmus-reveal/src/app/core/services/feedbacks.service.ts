import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonModelService } from '@cognizone/json-model';
import { Observable, switchMap } from 'rxjs';

import { Feedback, FeedbackFacets, FeedbackRequest, JsonModelFields, User } from '../models';
import { CustomIdGenerator } from './custom-id-generator.service';
import { ItemService } from './item.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class FeedbacksService extends ItemService<User> {
  index: string = 'feedbacks';

  constructor(http: HttpClient, jsonModelService: JsonModelService, idGenerator: CustomIdGenerator, private userService: UserService) {
    super(http, jsonModelService, idGenerator);
  }

  create(feedback: JsonModelFields<Feedback>, request: FeedbackRequest): Observable<string> {
    return this.userService.getByUri(request.user).pipe(
      switchMap(user => {
        const facets: FeedbackFacets = {
          requestingUser: user?.['@id'],
          requestingUserCountry: user?.country,
        };
        const fullFeedback = {
          ...this.jsonModelService.createNewBareboneJsonModel('Feedback'),
          ...feedback,
          '@facets': facets,
          request: request['@id'],
        };
        return this.save(fullFeedback);
      })
    );
  }
}
