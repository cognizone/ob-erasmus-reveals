import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateProfileComponent } from '../create-profile/create-profile.component';
import { delay, map, switchMap } from 'rxjs';
import { AuthService, JsonModelFields, User, UserService } from '@app/core';
import { OnDestroy$ } from '@cognizone/ng-core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'ob-erasmus-reveal-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GettingStartedComponent extends OnDestroy$ {
  constructor(private dialog: Dialog, private authService: AuthService, private userService: UserService, private dialogRef: DialogRef, private router: Router) {
    super();
  }

  onClick(): void {
    this.dialogRef.close(); // closes the first dialog
    this.subSink = this.dialog.open<JsonModelFields<User>>(CreateProfileComponent, {
      disableClose: true
    })
    .closed
    .pipe(
      switchMap(response => {
        return this.userService.create(response as JsonModelFields<User>).pipe(map(() => response));
      }),
      delay(1000),
      switchMap(data => {
        return this.authService.login(data?.email as string);
      })
    )
    .subscribe(() => {
      this.dialog.closeAll();
      this.router.navigate(['profile']);
    })
  }
}
