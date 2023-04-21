import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, Notification, NotificationService, User } from '@app/core';
import { map, merge, Observable, of, Subject, switchMap } from 'rxjs';

@Injectable()
export class ProfileViewService {
  user$!: Observable<User>;
  notifications$!: Observable<Notification[]>;
  private authService = inject(AuthService);
  private refresh$: Subject<void> = new Subject();

  constructor(private route: ActivatedRoute, private notificationService: NotificationService) {
    this.init();
  }

  private init(): void {
    this.user$ = this.route.data.pipe(map(data => data['user']));
    const refresh$ = this.refresh$.asObservable().pipe(map(() => this.route.snapshot.params));
    this.notifications$ = merge(this.route.params, refresh$).pipe(
      switchMap(() => {
        if (this.authService.currentUser) {
          return this.notificationService.getUnAcknowledgedNotifications();
        }
        return of([]);
      })
    );
  }

  refresh(): void {
    this.refresh$.next();
  }
}
