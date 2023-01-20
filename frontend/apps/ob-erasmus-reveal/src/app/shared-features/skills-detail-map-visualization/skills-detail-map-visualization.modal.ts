import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CountriesMapComponent } from '@app/shared-features/countries-map';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { SkillImageUrlPipe } from '@app/shared-features/skills-feedback';
import { ChartMetaData, Counts, FeedbacksService, RelationshipTypeService, User, UserService } from '@app/core';
import { OnDestroy$ } from '@cognizone/ng-core';
import { I18nService } from '@cognizone/i18n';
import { LangString } from '@cognizone/model-utils';
import { switchMap } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { SerializeUriPipe } from './pipes/serialize-uri.pipe';

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
  relation!: Relation;
  users!: User[];

  userCountPerSkill: number = 0;
  countriesPerSkill!: string[]
  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: ChartMetaData,
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
      this.relation = relations.reduce((a,b) => ({...a, [b['@id']]:( this.i18nService.czLabelToString(b.prefLabel as LangString)) || []}), {})
      this.cdr.markForCheck();
    })
  }

  onCountrySelected(name: string): void {
    this.subSink = this.feedbackService.getUsersForSkills(name, this.data.skillUri).pipe(
      switchMap(response => this.userService.getByUrisMulti(response))
    ).subscribe(users => {
      this.users = users;
      this.stepper.next();
      this.cdr.markForCheck();
    })
  }

  onUserCountryCountComputed(counts: Counts): void {
    this.countriesPerSkill = Object.keys(counts);
    if (this.countriesPerSkill.length > 0) {
      this.userCountPerSkill = Object.values(counts).reduce((a, b) => a + b);
    }
  }
}

interface Relation {
  [uri: string]: string
}
