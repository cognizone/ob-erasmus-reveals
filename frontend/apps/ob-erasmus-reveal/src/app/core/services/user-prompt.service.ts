import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class UserPromptService {
  constructor(private snack: MatSnackBar, private transloco: TranslocoService) {}

  error(message: string = 'global.unknown_error'): void {
    this.snack.open(this.transloco.translate(message), undefined, {
      duration: 10_000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'user-prompt-error',
    });
  }

  success(message: string = 'global.success'): void {
    this.snack.open(this.transloco.translate(message), undefined, {
      duration: 5_000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'user-prompt-success',
    });
  }
}