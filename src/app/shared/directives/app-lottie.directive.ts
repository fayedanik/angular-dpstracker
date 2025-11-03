import { isPlatformBrowser } from '@angular/common';
import { DotLottie } from '@lottiefiles/dotlottie-web';

import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';

@Directive({
  selector: '[appLottie]',
  standalone: true,
})
export class AppLottie implements OnInit {
  @Input('appLottie') src!: string;
  @Input() autoplay: boolean = true;
  @Input() loop: boolean = true;

  constructor(
    private el: ElementRef<HTMLCanvasElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.src) return;
    this.loadAnimation();
  }

  private loadAnimation() {
    new DotLottie({
      canvas: this.el.nativeElement,
      src: this.src,
      autoplay: this.autoplay,
      loop: this.loop,
    });
  }
}
