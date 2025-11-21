import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
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
    TranslatePipe,
  ],
  templateUrl: './dps-card.component.html',
  styleUrl: './dps-card.component.scss',
})
export class DpsCardComponent {
  private readonly _router = inject(Router);
  dpsIn = input.required<IDps>();
  viewTermsAndCondition = output<void>();
  deleteDps = output<void>();
  takeConfirmation() {}

  gotoDpsDetails(id: string) {
    this._router.navigate(['dps', id]);
  }

  get dpsStatus() {
    const dps = this.dpsIn();
    if (!dps) return '-';
    if (new Date(dps.startDate) > new Date()) return 'Upcoming';
    else if (new Date(dps.maturityDate) < new Date()) return 'Expired';
    else return 'Active';
  }
}
