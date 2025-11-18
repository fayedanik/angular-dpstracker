import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-modal',
  imports: [
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    MatDividerModule,
    MatDialogModule,
  ],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
})
export class ConfirmationModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _dialogRef: MatDialogRef<ConfirmationModalComponent>
  ) {}
  cancel() {
    this._dialogRef.close(false);
  }
  confirm() {
    this._dialogRef.close(true);
  }
}
