import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ob-erasmus-reveal-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // TODO - Add a default value generation in angular.json or equivalent
})
export class SignupComponent {}
