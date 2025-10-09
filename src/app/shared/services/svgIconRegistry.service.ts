import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SvgIconRegistryService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.registerIcons();
  }

  private registerIcons(): void {
    const icons = [
      'left_panel_close',
      'eye',
      'arrow_trending_up',
      'arrow_trending_down',
      'building_office',
      'right_panel_close',
      'arrow_up_square',
    ];

    icons.forEach((icon) => {
      this.iconRegistry.addSvgIcon(
        icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `./../../../assets/icons/${icon}.svg`
        )
      );
    });
  }
}
