import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-spinner',
  imports: [CommonModule],
  templateUrl: './progress-spinner.component.html',
  styleUrl: './progress-spinner.component.scss',
})
export class ProgressSpinnerComponent {
  occupied = input.required<number>();

  getbackgroundImageProperty() {
    var degPerStep = Math.floor(360 / 100);
    let occupiedDeg = this.occupied() * degPerStep;
    if (this.occupied() == 100) occupiedDeg = 360;
    return `conic-gradient(#e8a111 ${occupiedDeg}deg, #d9d9d9 0deg)`;
  }
}
