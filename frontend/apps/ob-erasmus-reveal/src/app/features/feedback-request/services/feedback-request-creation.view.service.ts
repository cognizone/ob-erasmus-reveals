import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncodeUriService } from '@app/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class FeedbackRequestCreationViewService {
  skillsUris: Observable<string[]> = this.route.queryParams.pipe(map(({ skillUri }) => [this.encodeUriService.decode(skillUri)]))

  constructor(private route: ActivatedRoute, private encodeUriService: EncodeUriService) {}
}
