import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DpsService } from '../../../../core/services/dps.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { NoDataViewComponent } from '../../../../shared/components/no-data-view/no-data-view.component';
import { IDps, IDpsOwner } from '../../../../shared/interfaces/dps.interface';
import { DialogRootService } from '../../../../shared/services/dialog-root.service';
import { PlatformDetectorService } from '../../../../shared/services/platform-detector.service';
import { DpsAddMoneyComponent } from '../dps-add-money/dps-add-money.component';
@Component({
  selector: 'app-dps-details',
  imports: [
    CommonModule,
    TranslatePipe,
    NoDataViewComponent,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AvatarComponent,
    MatProgressBarModule,
    MatChipsModule,
  ],
  templateUrl: './dps-details.component.html',
  styleUrl: './dps-details.component.scss',
})
export class DpsDetailsComponent {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _dpsService = inject(DpsService);
  private readonly _dialogRootService = inject(DialogRootService);
  private readonly _bottomSheet = inject(MatBottomSheet);
  private readonly _platformDetectorService = inject(PlatformDetectorService);
  private readonly _dpsResponse = this._dpsService.getDpsById(
    this._route.snapshot.paramMap.get('id')
  );

  dpsRes = computed(() => {
    return this._dpsResponse &&
      this._dpsResponse.hasValue() &&
      this._dpsResponse.value().data
      ? this._dpsResponse.value().data
      : null;
  });

  totalAmountPaid = computed(() => {
    return (this.dpsRes()?.dpsOwners || []).reduce(
      (prev, x) => prev + (x.amountPaid ?? 0),
      0
    );
  });

  goBack() {
    this._router.navigate(['dps']);
  }

  addMoneyToDps(owner: IDpsOwner) {
    if (this._platformDetectorService.isPlaformMobile) {
      this._bottomSheet
        .open(DpsAddMoneyComponent, {
          data: {
            dps: this.dpsRes(),
            owner: owner,
          },
        })
        .afterDismissed()
        .subscribe(() => {
          this._dpsResponse?.reload();
        });
    } else {
      this._dialogRootService
        .openDialog(DpsAddMoneyComponent, {
          data: {
            dps: this.dpsRes(),
            owner: owner,
          },
        })
        .afterClosed()
        .subscribe(() => {
          this._dpsResponse?.reload();
        });
    }
  }

  getOwnerInstallmentPercentageAmount(dps: IDps, owner: IDpsOwner) {
    return (
      ((owner.amountPaid ?? 0) / (dps.monthlyAmount * dps.durationMonths)) * 100
    );
  }

  getTotalInstallPercentageAmount(dps: IDps) {
    return (
      ((this.totalAmountPaid() ?? 0) /
        (dps.monthlyAmount * dps.durationMonths * dps.dpsOwners.length)) *
      100
    );
  }
}
