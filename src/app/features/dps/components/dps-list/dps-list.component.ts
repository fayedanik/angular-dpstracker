import { Component, computed, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { DpsService } from '../../../../core/services/dps.service';
import { DialogRootService } from '../../../../shared/services/dialog-root.service';
import { PlatformDetectorService } from '../../../../shared/services/platform-detector.service';
import { AddDpsComponent } from '../add-dps/add-dps.component';
import { DpsCardComponent } from '../dps-card/dps-card.component';

@Component({
  selector: 'app-dps-list',
  imports: [TranslatePipe, MatIconModule, MatButtonModule, DpsCardComponent],
  templateUrl: './dps-list.component.html',
  styleUrl: './dps-list.component.scss',
})
export class DpsListComponent {
  private readonly _platformDetectorService = inject(PlatformDetectorService);
  private readonly _bottomSheet = inject(MatBottomSheet);
  private readonly _dialogRootService = inject(DialogRootService);
  private readonly _dpsService = inject(DpsService);
  private readonly _dpsListResponse = this._dpsService.getDpsList();

  dpsList = computed(() => {
    return this._dpsListResponse.hasValue() &&
      (this._dpsListResponse.value().data || []).length > 0
      ? this._dpsListResponse.value().data
      : [];
  });

  addDps() {
    if (this._platformDetectorService.isPlaformMobile) {
      this._bottomSheet
        .open(AddDpsComponent)
        .afterDismissed()
        .subscribe((res) => {
          if (!res) return;
          this._dpsListResponse.reload();
        });
    } else {
      this._dialogRootService
        .openDialog(AddDpsComponent)
        .afterClosed()
        .subscribe((res) => {
          if (!res) return;
          this._dpsListResponse.reload();
        });
    }
  }
}
