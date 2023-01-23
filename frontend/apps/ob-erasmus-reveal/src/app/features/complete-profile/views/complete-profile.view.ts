import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AuthService,
  CountriesService,
  Country,
  JsonModelFields,
  User,
  UserService
} from '@app/core';
import { map, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingService, OnDestroy$ } from '@cognizone/ng-core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatStepperModule } from '@angular/material/stepper';
import { I18nModule } from '@cognizone/i18n';
import { CompleteProfileViewService } from '../services/complete-profile.view.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LanguageSelectionComponent } from '@app/shared-features/language-selection';

@Component({
  selector: 'ob-erasmus-reveal-profile-complete',
  standalone: true,
  imports: [CommonModule, TranslocoModule, ReactiveFormsModule, NgOptimizedImage, MatStepperModule, I18nModule, MatIconModule, MatProgressBarModule, LanguageSelectionComponent],
  providers: [LoadingService, CompleteProfileViewService],
  templateUrl: './complete-profile.view.html',
  styleUrls: ['./complete-profile.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteProfileView extends OnDestroy$ implements OnInit {
  formGroup = this.fb.group({
    step1: this.fb.group({
      email: [{ value: this.completeProfileViewService.completeProfileParams['email'], disabled: true}],
      lastName: [''],
      firstName: [''],
    }),
    step2: this.fb.group({
      country: ['', Validators.required]
    })
  });

  countries: Country[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private countryService: CountriesService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public loadingService: LoadingService,
    private completeProfileViewService: CompleteProfileViewService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subSink = this.countryService.getAll().subscribe(countries => {
      this.countries = countries;
      this.cdr.markForCheck();
    })
  }

  onSubmit(): void {
    const users = this.formGroup.getRawValue();
    const user = {
      email: users.step1['email'],
      lastName: users.step1['lastName'],
      firstName: users.step1['firstName'],
      country: users.step2['country']
    } as JsonModelFields<User>;

    this.subSink = this.userService.create(user)
    .pipe(this.loadingService.asOperator(), map(() => user), switchMap(data => {
      return this.authService.login(data?.email as string);
    })).subscribe((user) => {
      if (user) this.router.navigate(['profile']);
    })
  }
}

