import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonModelService } from '@cognizone/json-model';
import { Dictionary } from '@cognizone/model-utils';
import { map, Observable, switchMap } from 'rxjs';

import { Counts, Feedback, FeedbackFacets, FeedbackRequest, JsonModelFields, User } from '../models';
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
    return this.userService.getByUri(request.user['@id']).pipe(
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

  getCountsPerCountry(skillUri: string): Observable<Counts> {
    const query = {
      size: 0,
      query: {
        bool: {
          filter: {
            term: {
              'endorsedSkills.keyword': skillUri,
            },
          },
        },
      },
      aggs: {
        counts: {
          terms: {
            field: '@facets.requestingUserCountry.keyword',
            size: 10_000,
          },
        },
      },
    };

    return this.elasticService.search(this.getIndex(), query).pipe(
      map(response => {
        const counts: Dictionary<number> = {};
        response.aggregations['counts'].buckets?.forEach(b => (counts[b.key] = b.doc_count));
        return counts;
      })
    );
  }

  override getAll(): Observable<Feedback[]> {
    throw new Error('Should not be called for this model');
  }
}
