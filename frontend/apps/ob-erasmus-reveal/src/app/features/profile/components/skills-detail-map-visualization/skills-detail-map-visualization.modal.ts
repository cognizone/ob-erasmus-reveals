import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CountriesMapComponent } from '@app/shared-features/countries-map';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { SkillImageUrlPipe } from '@app/shared-features/skills-feedback/pipes/skill-image-url.pipe';
import { FeedbacksService, RelationshipType, RelationshipTypeService, User, UserService } from '@app/core';
import { OnDestroy$ } from '@cognizone/ng-core';
import { I18nService } from '@cognizone/i18n';
import { LangString } from '@cognizone/model-utils';
import { ECElementEvent } from 'echarts';
import { switchMap } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { SerializeUriPipe } from '../../pipes/serialize-uri.pipe';

@Component({
  selector: 'ob-erasmus-reveal-skills-detail-map-visualization',
  standalone: true,
  imports: [
    CommonModule,
    CountriesMapComponent,
    MatIconModule,
    TranslocoModule,
    SkillImageUrlPipe,
    NgOptimizedImage,
    RouterModule,
    MatStepperModule,
    SerializeUriPipe
  ],
  templateUrl: './skills-detail-map-visualization.modal.html',
  styleUrls: ['./skills-detail-map-visualization.modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsDetailMapVisualizationModal extends OnDestroy$ implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  relation!: Relation[];
  users!: User[];

  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: any,
    private relationshipTypeService: RelationshipTypeService,
    private cdr: ChangeDetectorRef,
    private i18nService: I18nService,
    private userService: UserService,
    private feedbackService: FeedbacksService
  ) {
    super();
  }

  ngOnInit() {
    this.subSink = this.relationshipTypeService.getAll().subscribe(relations => {
      this.relation = Object.assign({}, ...relations.map(r => {
        return {
          [r['@id']]: this.i18nService.czLabelToString(r.prefLabel as LangString)
        }
      }));
      this.cdr.markForCheck();
    })
  }

  selectedCountry(event: ECElementEvent): void {
    this.subSink = this.feedbackService.getUsersForSkills(event.name, this.data.skillId).pipe(
      switchMap(response => this.userService.getByUrisMulti(response))
    ).subscribe(users => {
      this.users = users;
      this.stepper.next();
      this.cdr.markForCheck();
    })
  }
}

interface Relation {
  [uri: string]: RelationshipType
}
