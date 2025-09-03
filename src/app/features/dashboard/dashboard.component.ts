import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppLottie } from '../../shared/directives/app-lottie.directive';
@Component({
  selector: 'app-dashboard',
  imports: [AppLottie, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor() {}
}
