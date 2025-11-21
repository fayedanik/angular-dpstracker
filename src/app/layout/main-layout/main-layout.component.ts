import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { PlatformDetectorService } from '../../shared/services/platform-detector.service';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';
import { SidePanelComponent } from '../components/side-panel/side-panel.component';
@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    NavBarComponent,
    MatSidenavModule,
    SidePanelComponent,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  constructor() {
    effect(() => {
      this.isOpened.set(this._platformDetectorService.isPlatformWeb);
      if (this._routeChange() && !this.isWeb) {
        this.closeSideNav();
      }
    });
  }
  private readonly _platformDetectorService = inject(PlatformDetectorService);
  private readonly _router = inject(Router);
  private _routeChange = toSignal(
    this._router.events.pipe(filter((event) => event instanceof NavigationEnd))
  );
  isOpened = signal<boolean>(this._platformDetectorService.isPlatformWeb);
  toggleSideNav = () => {
    this.isOpened.update((x) => !x);
  };
  openSideNav() {
    this.isOpened.set(true);
  }
  closeSideNav() {
    this.isOpened.set(false);
  }
  get isWeb() {
    return this._platformDetectorService.isPlatformWeb;
  }
}
