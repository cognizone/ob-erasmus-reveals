import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OnDestroy$ } from '@cognizone/ng-core';

@Injectable()
export class CompleteProfileViewService extends OnDestroy$ implements OnDestroy {
  completeProfileParams!: Params;

  constructor(private route: ActivatedRoute) {
    super();
    this.init();
  }

  init(): void {
    this.subSink = this.route.queryParams.subscribe(({ email }) => {
      this.completeProfileParams = {
        email
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
