import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OnDestroy$ } from '@cognizone/ng-core';

@Injectable()
export class EndorseSkillsViewService extends OnDestroy$ implements OnDestroy {
  endorseSkillsParams!: Params;

  constructor(private route: ActivatedRoute) {
    super();
    this.init();
  }

  init(): void {
    this.subSink = this.route.queryParams.subscribe(({ email, feedbackRequestId }) => {
      this.endorseSkillsParams = {
        email,
        feedbackRequestId: decodeURIComponent(feedbackRequestId)
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
