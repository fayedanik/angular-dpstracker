import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { ToastData } from '../../services/toast-message.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  snackBarRef = inject(MatSnackBarRef<ToastComponent>);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: ToastData) {}
}
