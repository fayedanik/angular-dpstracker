import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { IDps } from '../../../../shared/interfaces/dps.interface';
@Component({
  selector: 'app-dps-card',
  imports: [MatCardModule, CommonModule, MatChipsModule, AvatarComponent],
  templateUrl: './dps-card.component.html',
  styleUrl: './dps-card.component.scss',
})
export class DpsCardComponent {
  dpsIn = input.required<IDps>();
}
