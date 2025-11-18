import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { IDps } from '../../../../shared/interfaces/dps.interface';

@Component({
  selector: 'app-dps-card',
  imports: [
    MatCardModule,
    CommonModule,
    MatChipsModule,
    AvatarComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './dps-card.component.html',
  styleUrl: './dps-card.component.scss',
})
export class DpsCardComponent {
  private readonly _router = inject(Router);
  dpsIn = input.required<IDps>();
  deleteDps = output<void>();
  takeConfirmation() {}

  gotoDpsDetails(id: string) {
    this._router.navigate(['dps', id]);
  }
}
