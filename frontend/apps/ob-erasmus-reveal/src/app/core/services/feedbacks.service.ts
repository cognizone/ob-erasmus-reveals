import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonModelService } from '@cognizone/json-model';
import { Observable, switchMap } from 'rxjs';

import { Feedback, FeedbackFacets, FeedbackRequest, JsonModelFields, User } from '../models';
import { ConfigService } from './config.service';
import { CustomIdGenerator } from './custom-id-generator.service';
import { ElasticService } from './elastic.service';
import { ItemService } from './item.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class FeedbacksService extends ItemService<Feedback> {
  collectionName: string = 'feedbacks';

  constructor(
    http: HttpClient,
    jsonModelService: JsonModelService,
    idGenerator: CustomIdGenerator,
    configService: ConfigService,
    elasticService: ElasticService,
    private userService: UserService
  ) {
    super(http, jsonModelService, idGenerator, configService, elasticService);
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

  override getAll(): Observable<Feedback[]> {
    throw new Error('Should not be called for this model');
  }
}
