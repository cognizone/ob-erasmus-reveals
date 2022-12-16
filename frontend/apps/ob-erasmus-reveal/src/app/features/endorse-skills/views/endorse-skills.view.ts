import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { AuthService, CountriesService, Country, RelationshipType, RelationshipTypeService } from '@app/core';
import { I18nModule } from '@cognizone/i18n';
import { OnDestroy$ } from '@cognizone/ng-core';
import { TranslocoModule } from '@ngneat/transloco';
import { AppLogoComponent } from '@app/shared-features/app-logo';

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
    AppLogoComponent
  ],
  templateUrl: './endorse-skills.view.html',
  styleUrls: ['./endorse-skills.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndorseSkillsView extends OnDestroy$ implements OnInit {
  formGroup = this.fb.group({
    step1: this.fb.group({
      email: [{ value: '', disabled: true }], // TODO - replace with queryParams when the mail part is ready
      lastName: [''],
      firstName: [''],
      relationshipType: ['', Validators.required],
    }),
    step2: this.fb.group({
      country: [''],
    }),
  });

  countries: Country[] = [];
  relationType: RelationshipType[] = [];
  user!: string;

  constructor(
    private fb: FormBuilder,
    private countryService: CountriesService,
    private cdr: ChangeDetectorRef,
    private relationService: RelationshipTypeService,
    public authService: AuthService
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

    this.user = this.authService.currentUser.firstName ?? (this.authService.currentUser.email as string);
  }
}
