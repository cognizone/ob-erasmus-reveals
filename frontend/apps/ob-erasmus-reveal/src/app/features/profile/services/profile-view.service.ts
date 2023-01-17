import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@app/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class ProfileViewService {
  user$!: Observable<User>;

  constructor(private route: ActivatedRoute) {
    this.init();
  }

  private init(): void {
    this.user$ = this.route.data.pipe(map(data => data['user']));
  }
}
