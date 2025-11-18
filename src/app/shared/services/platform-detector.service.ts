// hybrid-platform-detector.service.ts
import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, Signal, signal } from '@angular/core';
import { map } from 'rxjs/operators';

export type PlatformType = 'web' | 'tablet' | 'mobile';

@Injectable({
  providedIn: 'root',
})
export class PlatformDetectorService {
  private userAgent: string = '';

  private _platform = signal<PlatformType>('web');

  constructor(
    private breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userAgent = navigator.userAgent.toLowerCase();
      const uaPlatform = this.detectUA();
      if (uaPlatform) {
        this._platform.set(uaPlatform);
      }
    }

    this.breakpointObserver
      .observe([
        '(max-width: 599px)', // Mobile
        '(min-width: 600px) and (max-width: 1249px)', // Tablet
        '(min-width: 1250px) and (max-width: 1439px)', // Web/Desktop
        '(min-width: 1440px)',
      ])
      .pipe(
        map((result) => {
          if (result.breakpoints['(max-width: 599px)']) {
            return 'mobile';
          } else if (
            result.breakpoints['(min-width: 600px) and (max-width: 1249px)']
          ) {
            return 'tablet';
          }
          return 'web';
        })
      )
      .subscribe((platform) => {
        this._platform.set(platform);
      });
  }

  private detectUA(): PlatformType | null {
    if (/android|iphone|ipod|blackberry|windows phone/i.test(this.userAgent)) {
      return 'mobile';
    } else if (/ipad|tablet|kindle/i.test(this.userAgent)) {
      return 'tablet';
    } else if (/windows|macintosh|linux/i.test(this.userAgent)) {
      return 'web';
    }
    return null;
  }

  getPlatformSync(): Signal<PlatformType> {
    return this._platform;
  }

  get isPlatformWeb() {
    return this._platform() === 'web';
  }

  get isPlaformMobile() {
    return this._platform() === 'mobile';
  }
}
