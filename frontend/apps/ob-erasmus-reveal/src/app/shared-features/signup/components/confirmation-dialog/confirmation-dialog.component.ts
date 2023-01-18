import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ob-erasmus-reveal-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, TranslocoModule, MatIconModule, NgOptimizedImage],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {
  constructor(@Inject(DIALOG_DATA) public data: Data, public dialogRef: DialogRef) {}
}

interface Data {
  email: string;
}
