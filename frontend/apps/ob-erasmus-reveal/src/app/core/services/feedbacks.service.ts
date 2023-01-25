import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonModelService } from '@cognizone/json-model';
import {
  Dictionary,
  extractSourcesFromElasticResponse,
  ElasticBucket,
  notNil,
  ElasticSearchResponse
} from '@cognizone/model-utils';
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
    return this.getCounts( 'endorsedSkills', skillUri, '@facets.requestingUserCountry', true);
  }

  getSkillsCountsPerUser(userUri: string): Observable<Counts> {
    return this.getCounts( '@facets.requestingUser', userUri, 'endorsedSkills');
  }

  getGlobalSkillCount(): Observable<Counts> {
    const query = {
      size: 0,
      aggs: {
        counts: {
          terms: {
            field: 'endorsedSkills.keyword',
            size: 10_000,
          }
        }
      }
    };

    return this.elasticService.search(this.getIndex(), query).pipe(
      map(response => this.getAggregatedCounts(response))
    );
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

  getUsersForSkills(uri: string, skillUri: string): Observable<string[]> {
    return this.elasticService
    .search<Feedback>(this.getIndex(), {
      query: {
        bool: {
          must: [
            {
              term: {
                '@facets.requestingUserCountry.keyword': uri,
              },
            },
            {
              term: {
                'endorsedSkills.keyword': skillUri,
              },
            },
          ],
        },
      }
    })
    .pipe(map(extractSourcesFromElasticResponse), map(response => {
      return response.map(res => res?.["@facets"]?.requestingUser).filter(notNil) ?? []
    }));
  }

  override getAll(): Observable<Feedback[]> {
    throw new Error('Should not be called for this model');
  }

  private getCounts(term: string, uri: string, field: string, uniqueCount: boolean = false): Observable<Counts> {
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
          },
          aggs: {
            unique_count: {
              cardinality: {
                field: '@facets.requestingUser.keyword'
              }
            }
          }
        }
      }
    };

    return this.elasticService.search(this.getIndex(), query).pipe(
      map(response => this.getAggregatedCounts(response, uniqueCount))
    );
  }

  private getAggregatedCounts(response: ElasticSearchResponse<unknown>, uniqueCount: boolean = false): Counts {
    const counts: Dictionary<number> = {};
    response.aggregations['counts'].buckets?.forEach((b: ElasticBucketUnique) => (counts[b.key] = uniqueCount ? b.unique_count?.value as number : b.doc_count));
    return counts;
  }
}

interface ElasticBucketUnique extends ElasticBucket {
  unique_count?: {
    value: number
  }
}
