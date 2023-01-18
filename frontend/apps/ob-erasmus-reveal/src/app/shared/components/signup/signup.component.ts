import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '@app/core';
import { OnDestroy$ } from '@cognizone/ng-core';
import { Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'ob-erasmus-reveal-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent extends OnDestroy$ {
  @Input()
  login: boolean = false;
  userEmail = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  constructor(
    private authService: AuthService,
    private dialog: Dialog,
    private router: Router
  ) {
    super();
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    if (!this.userEmail.get('email')?.invalid && this.userEmail.get('email')?.touched) {
      const email = this.userEmail.getRawValue().email as string;

      if (this.login) {
        this.subSink = this.authService.login(email).subscribe(userValid => {
          if (userValid) this.router.navigate(['profile']);
        })
      } else {
        // TODO make the API call for register and send email;
        this.authService.register(email);
        this.subSink =  this.dialog.open(ConfirmationDialogComponent, {
          disableClose: true,
          data: {
            email
          }
        })
        .closed
        .subscribe(() => {
          this.router.navigate(['complete-profile'])
        })
      }
    }
  }
}
