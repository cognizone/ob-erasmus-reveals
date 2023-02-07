import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncodeUriService } from '@app/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class FeedbackRequestCreationViewService {
  skillsUris$: Observable<string[] | undefined> = this.route.queryParams.pipe(
    map(({ skillUri }) => {
      if (skillUri) return [this.encodeUriService.decode(skillUri)];
      return undefined;
    })
  );

  constructor(private route: ActivatedRoute, private encodeUriService: EncodeUriService) {}
}
