import { ComponentType } from '@angular/cdk/overlay';
import { inject, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogRootService {
  private readonly _dialog = inject(MatDialog);
  private readonly _defaultDialogConfig: MatDialogConfig = {
    width: '400px',
    minWidth: '380px',
    maxWidth: '400px',
    enterAnimationDuration: '500ms',
    exitAnimationDuration: '200ms',
  };
  private _dialogRef: MatDialogRef<any, any> | null = null;
  openDialog(component: ComponentType<unknown>, config: MatDialogConfig = {}) {
    this._dialogRef = this._dialogRef = this._dialog.open(component, {
      ...this._defaultDialogConfig,
      ...config,
    });
    return this._dialogRef;
  }

  closeDialog() {
    if (!this._dialogRef) return;
    this._dialogRef.close();
  }
}
