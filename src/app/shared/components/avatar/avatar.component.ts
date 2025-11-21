import { Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  displayName = input.required<string>();

  get userShortName() {
    const namesPart = this.displayName()
      .split(' ')
      .map((x) => x.trim())
      .filter((x) => !!x);
    if (namesPart.length > 1) return namesPart[0][0] + namesPart[1][0];
    else
      return namesPart[0][0] + (namesPart[0].length > 1 ? namesPart[0][1] : '');
  }
}
