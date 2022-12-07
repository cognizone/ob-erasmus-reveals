import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CountriesService, Country, JsonModelFields, User, UserService } from '@app/core';
import { OnDestroy$ } from '@cognizone/ng-core';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'ob-erasmus-reveal-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProfileComponent extends OnDestroy$ implements OnInit{
  formGroup = this.fb.group({
    step1: this.fb.group({
      email: [{ value: localStorage.getItem('temp'), disabled: true}], // TODO - replace with queryParams when the mail part is ready
      lastName: [''],
      firstName: [''],
    }),
    step2: this.fb.group({
      country: ['', Validators.required]
    })
  });

  countries: Country[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: DialogRef<JsonModelFields<User>>,
    private countryService: CountriesService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
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
    this.dialogRef.close(user);
  }
}
