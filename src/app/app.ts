import { Component, inject, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/services/auth.service';
import { PlatformDetectorService } from './shared/services/platform-detector.service';
import { SvgIconRegistryService } from './shared/services/svgIconRegistry.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressBarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Fintelligence');
  private translate = inject(TranslateService);
  private authService = inject(AuthService);
  isLoading = signal(false);
  constructor(
    private iconRegistry: SvgIconRegistryService,
    private platformDetectorService: PlatformDetectorService
  ) {
    this.translate.addLangs(['en', 'bn']);
    this.translate.setFallbackLang('en');
    this.translate.use('en');

    inject(Router).events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading.set(false);
      }
    });
  }
}
