import { Component, computed, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { catchError, of, tap } from 'rxjs';
import { DpsService } from '../../../../core/services/dps.service';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';
import { NoDataViewComponent } from '../../../../shared/components/no-data-view/no-data-view.component';
import { ErrorMessageConst } from '../../../../shared/consts/errorMessage.const';
import { IDps } from '../../../../shared/interfaces/dps.interface';
import { DialogRootService } from '../../../../shared/services/dialog-root.service';
import { PlatformDetectorService } from '../../../../shared/services/platform-detector.service';
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
import { AddDpsComponent } from '../add-dps/add-dps.component';
import { DpsCardComponent } from '../dps-card/dps-card.component';

@Component({
  selector: 'app-dps-list',
  imports: [
    TranslatePipe,
    MatIconModule,
    MatButtonModule,
    DpsCardComponent,
    NoDataViewComponent,
  ],
  templateUrl: './dps-list.component.html',
  styleUrl: './dps-list.component.scss',
})
export class DpsListComponent {
  private readonly _platformDetectorService = inject(PlatformDetectorService);
  private readonly _bottomSheet = inject(MatBottomSheet);
  private readonly _dialogRootService = inject(DialogRootService);
  private readonly _toastMessageService = inject(ToastMessageService);
  private readonly _translateService = inject(TranslateService);
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

  deleteDps(data: IDps) {
    this._dialogRootService
      .openDialog(ConfirmationModalComponent)
      .afterClosed()
      .subscribe((res) => {
        if (!res) return;
        this._dpsService
          .deleteDps({ id: data.id })
          .pipe(
            tap((res) => res.success),
            catchError((err) => of(false))
          )
          .subscribe((res) => {
            if (res) this._dpsListResponse.reload();
            else
              this._toastMessageService.showFailed(
                this._translateService.instant(
                  ErrorMessageConst.SOMETHING_WENT_WRONG_WHILE_DELETING_DPS
                )
              );
          });
      });
  }
}
