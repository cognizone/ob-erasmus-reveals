import { Injectable } from '@angular/core';
import { JsonModelFields, Notification } from '../models';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JsonModelService } from '@cognizone/json-model';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { CustomIdGenerator } from './custom-id-generator.service';
import { ElasticService } from './elastic.service';
import { ItemService } from './item.service';
import { extractSourcesFromElasticResponse } from '@cognizone/model-utils';

@Injectable({ providedIn: 'root' })
export class NotificationService extends ItemService<Notification> {
  collectionName: string = 'notification';

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

  create(notification: JsonModelFields<Notification>): Observable<string> {
    const fullNotification = {
      ...this.jsonModelService.createNewBareboneJsonModel('Notification'),
      ...notification
    };
    return this.save(fullNotification);
  }

  getUnAcknowledgedNotifications(): Observable<Notification[]> {
    return this.elasticService
    .search<Notification>(this.getIndex(), {
      size: 10_000,
      query: {
        bool: {
          filter: [
            {
              term: {
                'acknowledged': false,
              },
            },
            {
              term: {
                'endorsedUser.keyword': this.authService.currentUser['@id']
              }
            }
          ],
        },
      },
    })
    .pipe(map(extractSourcesFromElasticResponse));
  }
}
