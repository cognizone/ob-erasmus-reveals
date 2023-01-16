import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonModelService } from '@cognizone/json-model';
import { Dictionary, extractSourcesFromElasticResponse } from '@cognizone/model-utils';
import { map, Observable } from 'rxjs';

import { Counts, Feedback, JsonModelFields } from '../models';
import { ConfigService } from './config.service';
import { CustomIdGenerator } from './custom-id-generator.service';
import { ElasticService } from './elastic.service';
import { ItemService } from './item.service';

@Injectable({ providedIn: 'root' })
export class FeedbacksService extends ItemService<Feedback> {
  collectionName: string = 'feedbacks';

  constructor(
    http: HttpClient,
    jsonModelService: JsonModelService,
    idGenerator: CustomIdGenerator,
    configService: ConfigService,
    elasticService: ElasticService
  ) {
    super(http, jsonModelService, idGenerator, configService, elasticService);
  }

  create(feedback: JsonModelFields<Feedback>): Observable<string> {
    const fullFeedback = {
      ...this.jsonModelService.createNewBareboneJsonModel('Feedback'),
      ...feedback
    };
    return this.save(fullFeedback);
  }

  // TODO - modify the params to `as const`
  getCountsPerCountry(skillUri: string): Observable<Counts> {
    return this.getCounts( 'endorsedSkills', skillUri, '@facets.requestingUserCountry');
  }

  getSkillsCountsPerUser(userUri: string): Observable<Counts> {
    return this.getCounts( '@facets.requestingUser', userUri, 'endorsedSkills');
  }

  getFeedbacksForUser(uri: string): Observable<Feedback[]> {
    return this.elasticService
    .search<Feedback>(this.getIndex(), {
      query: {
        bool: {
          filter: {
            terms: {
              '@facets.requestingUser.keyword': [uri],
            },
          },
        },
      },
    })
    .pipe(map(extractSourcesFromElasticResponse));
  }

  override getAll(): Observable<Feedback[]> {
    throw new Error('Should not be called for this model');
  }

  private getCounts(term: string, uri: string, field: string): Observable<Counts> {
    const query = {
      size: 0,
      query: {
        bool: {
          filter: {
            term: {
              [`${term}.keyword`]: uri,
            },
          },
        },
      },
      aggs: {
        counts: {
          terms: {
            field: `${field}.keyword`,
            size: 10_000,
          }
        }
      }
    };

    return this.elasticService.search(this.getIndex(), query).pipe(
      map(response => {
        const counts: Dictionary<number> = {};
        response.aggregations['counts'].buckets?.forEach(b => (counts[b.key] = b.doc_count));
        return counts;
      })
    );
  }
}
