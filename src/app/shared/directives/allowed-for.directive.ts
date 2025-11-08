import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { UserService } from '../../core/services/user.service';

@Directive({
  selector: '[allowedFor]',
  standalone: true,
})
export class AppAllowedForDirectivce implements OnInit {
  @Input() allowedFor: string | string[] = [];
  private readonly _userService = inject(UserService);
  private readonly _renderer = inject(Renderer2);
  private readonly _el = inject(ElementRef);
  private readonly _viewContainerRef = inject(ViewContainerRef);
  ngOnInit(): void {
    if (typeof this.allowedFor == 'string') {
      this.allowedFor = [this.allowedFor];
    }
    const user = this._userService.User();
    if (!user) return;
    const isAllowed = user.roles.some((x) => this.allowedFor.includes(x));
    if (!isAllowed) {
      this._renderer.setStyle(this._el.nativeElement, 'display', 'none');
      this._viewContainerRef.clear();
    } else {
      this._renderer.removeStyle(this._el.nativeElement, 'display');
    }
  }
}
