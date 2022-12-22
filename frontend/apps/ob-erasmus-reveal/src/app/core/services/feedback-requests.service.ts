import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonModelService } from '@cognizone/json-model';
import { Observable, switchMap } from 'rxjs';

import { FeedbackRequest } from '../models';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { CustomIdGenerator } from './custom-id-generator.service';
import { ElasticService } from './elastic.service';
import { ItemService } from './item.service';

@Injectable({ providedIn: 'root' })
export class FeedbackRequestsService extends ItemService<FeedbackRequest> {
  collectionName: string = 'feedback-requests';

  constructor(
    http: HttpClient,
    jsonModelService: JsonModelService,
    idGenerator: CustomIdGenerator,
    configService: ConfigService,
    elasticService: ElasticService,
    private authService: AuthService
  ) {
    super(http, jsonModelService, idGenerator, configService, elasticService);
  }

  createBase(requestBase: Pick<FeedbackRequest, 'skills'>): Observable<FeedbackRequest> {
    const request = { ...this.jsonModelService.createNewBareboneJsonModel('FeedbackRequest'), ...requestBase } as FeedbackRequest;
    request.user = this.authService.currentUser['@id'];

    return this.save(request).pipe(switchMap(uri => this.getByUri(uri)));
  }

  override getAll(): Observable<FeedbackRequest[]> {
    throw new Error('Should not be called for this model');
  }
}
