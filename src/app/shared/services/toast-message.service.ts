import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ToastComponent } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastMessageService {
  private readonly _snackBar = inject(MatSnackBar);

  private readonly _defaultConfig: MatSnackBarConfig = {
    horizontalPosition: 'right',
    verticalPosition: 'top',
    duration: 3000,
    panelClass: ['toast-panel'],
  };

  showSuccess(message: string, config?: Partial<MatSnackBarConfig>) {
    this._snackBar.openFromComponent(ToastComponent, {
      ...this._defaultConfig,
      panelClass: [...(config?.panelClass || []), 'toast-success'],
      data: {
        type: 'success',
        title: 'Success',
        message: message,
      } as ToastData,
    });
  }

  showFailed(message: string, config?: Partial<MatSnackBarConfig>) {
    this._snackBar.openFromComponent(ToastComponent, {
      ...this._defaultConfig,
      panelClass: [...(config?.panelClass || []), 'toast-error'],
      data: {
        type: 'error',
        title: 'Error',
        message: message,
      } as ToastData,
    });
  }
}

export interface ToastData {
  message: string;
  title?: string;
  type?: 'success' | 'error' | 'info' | 'warn';
  actionText?: string;
}
