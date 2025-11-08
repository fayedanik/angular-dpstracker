import { DatePipe } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
@Component({
  selector: 'app-nav-bar',
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatRippleModule,
    MatMenuModule,
    MatSlideToggleModule,
    DatePipe,
    AvatarComponent,
    TranslatePipe,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  user = inject(UserService).User;
  authService = inject(AuthService);
  router = inject(Router);
  private readonly _translate = inject(TranslateService);
  dateNow = signal<Date>(new Date());
  isDark = signal(false);
  toggleSideNav = output<void>();
  isOpendedSideNav = input<boolean>(false);
  toggleLightDarkMode() {
    if (!document.body.classList.contains('dark')) {
      this.goToDarkMode();
      localStorage.setItem('theme', 'dark');
    } else {
      this.goToLightMode();
      localStorage.setItem('theme', 'light');
    }
  }

  changeLang(event: MatSlideToggleChange) {
    if (event.checked) {
      this._translate.use('bn');
    } else {
      this._translate.use('en');
    }
  }

  logOut() {
    this.authService.logout().subscribe(async (res) => {
      if (!res) return;
      await this.router.navigate(['/login']);
    });
  }

  constructor() {
    const saved = localStorage.getItem('theme');
    if (
      saved == 'dark' ||
      (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.goToDarkMode();
    } else {
      this.goToLightMode();
    }
  }

  private goToDarkMode() {
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    this.isDark.set(true);
  }

  private goToLightMode() {
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    this.isDark.set(false);
  }
}
