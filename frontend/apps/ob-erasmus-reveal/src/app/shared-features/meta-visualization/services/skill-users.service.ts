import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedbacksService, User, UserService } from '@app/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';

import { ChartData, SkillsParams } from '../models';

@Injectable()
export class SkillUsersService {
  selectedUris$: Observable<SkillsParams> = this.route.queryParams;
  chartsData$: BehaviorSubject<ChartData[]> = new BehaviorSubject<ChartData[]>([]);
  users$: Observable<User[]> = this.selectedUris$.pipe(
    switchMap(params => {
      if (params.selectedCountryUri && params.selectedSkillUri) {
        return this.getUsers(decodeURIComponent(params.selectedCountryUri), decodeURIComponent(params.selectedSkillUri));
      }
      return of([]);
    })
  );

  constructor(private route: ActivatedRoute, private feedbackService: FeedbacksService, private userService: UserService) {}

  getUsers(countryUri: string, skillUri: string): Observable<User[]> {
    return this.feedbackService
      .getUsersForSkills(countryUri, skillUri)
      .pipe(switchMap(response => this.userService.getByUrisMulti(response)));
  }
}
