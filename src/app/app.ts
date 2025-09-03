import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  constructor(
    private iconRegistry: SvgIconRegistryService,
    private platformDetectorService: PlatformDetectorService
  ) {}
}
