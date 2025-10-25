import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
    private readonly _dialogRef: MatDialogRef<ConfirmationModalComponent>
  ) {}
  cancel() {
    this._dialogRef.close(false);
  }
  confirm() {
    this._dialogRef.close(true);
  }
}
