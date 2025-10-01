import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/services/auth.service';
import { PlatformDetectorService } from './shared/services/platform-detector.service';
import { SvgIconRegistryService } from './shared/services/svgIconRegistry.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('dps-tracker-frontend');
  private translate = inject(TranslateService);
  private authService = inject(AuthService);
  constructor(
    private iconRegistry: SvgIconRegistryService,
    private platformDetectorService: PlatformDetectorService
  ) {
    this.translate.addLangs(['en', 'bn']);
    this.translate.setFallbackLang('en');
    this.translate.use('en');
  }
}
