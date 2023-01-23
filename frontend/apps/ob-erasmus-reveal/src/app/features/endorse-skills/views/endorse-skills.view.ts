import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { Params, Router, RouterModule } from '@angular/router';
import {
  AuthService,
  CountriesService,
  Country,
  Feedback,
  FeedbackFacets,
  FeedbackRequest,
  FeedbackRequestsService,
  FeedbacksService,
  JsonModelFields,
  RelationshipType,
  RelationshipTypeService,
  Skill,
  SkillsService
} from '@app/core';
import { I18nModule } from '@cognizone/i18n';
import { LoadingService, OnDestroy$ } from '@cognizone/ng-core';
import { TranslocoModule } from '@ngneat/transloco';
import { AppLogoComponent } from '@app/shared-features/app-logo';
import { SkillsFeedbackComponent } from '@app/shared-features/skills-feedback';
import { map, Observable, of, switchMap } from 'rxjs';
import { TextFieldModule } from '@angular/cdk/text-field';
import { EndorseSkillsViewService } from '../services/endorse-skills-view.service';
import { EndorsementCompleteComponent } from '../components/endorsement-complete/endorsement-complete.component';
import { Dialog } from '@angular/cdk/dialog';
import {
  FeedbackSentToProfileModal
} from '../components/feedback-sent-to-profile/feedback-sent-to-profile.modal';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LanguageSelectionComponent } from '@app/shared-features/language-selection';

@Component({
  selector: 'ob-erasmus-reveal-endorse-skills',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    TranslocoModule,
    RouterModule,
    MatStepperModule,
    ReactiveFormsModule,
    I18nModule,
    MatIconModule,
    TextFieldModule,
    AppLogoComponent,
    SkillsFeedbackComponent,
    EndorsementCompleteComponent,
    FeedbackSentToProfileModal,
    MatProgressBarModule,
    LanguageSelectionComponent
  ],
  providers: [LoadingService, EndorseSkillsViewService],
  templateUrl: './endorse-skills.view.html',
  styleUrls: ['./endorse-skills.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndorseSkillsView extends OnDestroy$ implements OnInit {
  endorseSkillsParams: Params = this.endorseSkillsService.endorseSkillsParams
  formGroup = this.fb.group({
    step1: this.fb.group({
      fromEmail: [{ value: this.endorseSkillsParams['email'], disabled: true }],
      fromLastName: [''],
      fromFirstName: [''],
      relationshipType: ['', Validators.required],
    }),
    step2: this.fb.group({
      fromCountry: [''],
    }),
    step3: this.fb.group({
      selectedSkills: [this.selectedSkills, [Validators.required, Validators.minLength(1)]]
    }),
    step4: this.fb.group({
      text: ['', Validators.required]
    })
  });

  countries: Country[] = [];
  relationType: RelationshipType[] = [];
  requestingUser!: string;
  skills!: Skill[];
  feedbackRequest!: FeedbackRequest;
  endorsementComplete: boolean = false;
  loading$: Observable<boolean> = this.loadingService.loading$;

  constructor(
    private fb: FormBuilder,
    private countryService: CountriesService,
    private cdr: ChangeDetectorRef,
    private relationService: RelationshipTypeService,
    private feedbackRequestService: FeedbackRequestsService,
    private skillsService: SkillsService,
    private feedbackService: FeedbacksService,
    private endorseSkillsService: EndorseSkillsViewService,
    private router: Router,
    private authService: AuthService,
    private dialog: Dialog,
    private loadingService: LoadingService
  ) {
    super();
  }

  ngOnInit() {
    this.subSink = this.relationService.getAll().subscribe(relationType => {
      this.relationType = relationType;
      this.cdr.markForCheck();
    });

    this.subSink = this.countryService.getAll().subscribe(countries => {
      this.countries = countries;
      this.cdr.markForCheck();
    });


    this.subSink = this.feedbackRequestService.getFeedbackRequest(this.endorseSkillsParams['feedbackRequestId'])
    .pipe(this.loadingService.asOperator(), switchMap((request) => this.skillsService.getSkillForEndorsement(request.skills as string[])
    .pipe(map(skills => ({ request, skills })))))
    .subscribe(({ request, skills }) => {
      this.requestingUser = request['@facets']?.firstName || request['@facets']?.email as string;
      this.skills = skills;
      this.feedbackRequest = request;
      this.cdr.markForCheck();
    });
  }

  get selectedSkills(): string[] {
    return this.formGroup?.controls.step3?.controls.selectedSkills.value ?? [];
  }

  setSelectedSkills(skills: string[]): void {
    if (skills.length > 0) {
      this.formGroup.controls.step3.setValue({ selectedSkills: skills });
    } else {
      this.formGroup.controls.step3.controls.selectedSkills.reset();
    }
  }

  onSubmit(): void {
    const facets: FeedbackFacets = {
      requestingUser: this.feedbackRequest.user,
      requestingUserCountry: this.feedbackRequest?.['@facets']?.country,
    };
    const feedback = {
      fromEmail: this.endorseSkillsParams['email'],
      fromFirstName: this.formGroup.value.step1?.['fromFirstName'],
      fromLastName: this.formGroup.value.step1?.['fromLastName'],
      relationshipType: this.formGroup.value.step1?.['relationshipType'],
      fromCountry: this.formGroup.value.step2?.['fromCountry'],
      endorsedSkills: this.selectedSkills,
      '@facets': facets,
      request: this.feedbackRequest?.['@id'],
      text: this.formGroup.value.step4?.['text'],
      created: new Date().toISOString()
    } as JsonModelFields<Feedback>;

    this.subSink = this.feedbackService.create(feedback).pipe(
      switchMap(() => {
        if (this.endorseSkillsParams['email'] === this.authService.currentUser?.email) {
          this.dialog.open(FeedbackSentToProfileModal, {
            data: { requestingUser: this.requestingUser },
          });
          return of(true)
        }
        return of(false);
      })
    ).subscribe((request) => {
      if (request) {
        this.router.navigate(['profile']);
      } else {
        this.endorsementComplete = true;
      }
      this.cdr.markForCheck();
    });
  }
}
