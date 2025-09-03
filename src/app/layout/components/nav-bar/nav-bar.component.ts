import { DatePipe } from '@angular/common';
import { Component, output, signal } from '@angular/core';
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
  toggleSideNav = output<void>();
  //toggleSideNav() {}
}
