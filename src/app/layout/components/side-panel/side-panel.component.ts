import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { UserService } from '../../../core/services/user.service';
import { navigations } from '../../../navigation';

@Component({
  selector: 'app-side-panel',
  imports: [
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
  ],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss',
})
export class SidePanelComponent {
  private readonly _userService = inject(UserService);
  private readonly _appList = this._userService.AppList;
  copyrightYear = signal(new Date().getFullYear());
  appList = computed(() => {
    return navigations.filter((x) => this._appList().includes(x.featureId));
  });
}
