import { DatePipe } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
@Component({
  selector: 'app-nav-bar',
  imports: [MatButtonModule, MatToolbarModule, MatIconModule, DatePipe],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  dateNow = signal<Date>(new Date());
  isDark = signal(false);
  toggleSideNav = output<void>();
  isOpendedSideNav = input<boolean>(false);
  toggleLightDarkMode() {
    if (!document.body.classList.contains('dark')) {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
      this.isDark.set(true);
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      this.isDark.set(false);
    }
  }
}
