import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, UserPromptService } from '@app/core';
import { OnDestroy$ } from '@cognizone/ng-core';

@Component({
  selector: 'ob-erasmus-reveal-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, TranslocoModule, MatIconModule, NgOptimizedImage],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent extends OnDestroy$ {
  isDisabled: boolean = false;

  constructor(
    @Inject(DIALOG_DATA) public data: Data,
    public dialogRef: DialogRef,
    private authService: AuthService,
    private userPrompt: UserPromptService,
    private transloco: TranslocoService
  ) {
    super();
  }

  onClick(): void {
    this.isDisabled = true;
    this.subSink = this.authService.register(this.data.email).subscribe(() => {
      this.userPrompt.success(this.transloco.translate('email_confirmation.email_sent'));
      this.isDisabled = false;
      this.dialogRef.close();
    },() => {
      this.isDisabled = false;
      this.userPrompt.error();
    })
  }
}

interface Data {
  email: string;
}
