import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification, NotificationService, User } from '@app/core';
import { delay, map, merge, Observable, Subject, switchMap } from 'rxjs';

@Injectable()
export class ProfileViewService {
  user$!: Observable<User>;
  notifications$!: Observable<Notification[]>;
  private refresh$: Subject<void> = new Subject();

  constructor(private route: ActivatedRoute, private notificationService: NotificationService) {
    this.init();
  }

  private init(): void {
    this.user$ = this.route.data.pipe(map(data => data['user']));
    const refresh$ = this.refresh$.asObservable().pipe(map(() => this.route.snapshot.params));
    this.notifications$ = merge(this.route.params, refresh$).pipe((delay(1000)),switchMap(() => {
     return this.notificationService.getUnAcknowledgedNotifications();
    }));
  }

  refresh(): void {
    this.refresh$.next()
  }
}
