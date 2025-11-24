import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, Inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { catchError, finalize, map, of } from 'rxjs';
import { TransactionService } from '../../../../core/services/transaction.service';
import { UserService } from '../../../../core/services/user.service';
import {
  Role,
  TransactionTypeEnum,
} from '../../../../shared/consts/business.const';
import { ErrorMessageConst } from '../../../../shared/consts/errorMessage.const';
import { ITransaction } from '../../../../shared/interfaces/transaction.interface';
import { TakaPipe } from '../../../../shared/pipes/taka-currency.pipe';
import { PlatformDetectorService } from '../../../../shared/services/platform-detector.service';
import { ToastMessageService } from '../../../../shared/services/toast-message.service';

@Component({
  selector: 'app-view-transaction-details',
  imports: [
    CommonModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    TranslatePipe,
    MatDialogModule,
    TakaPipe,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    ClipboardModule,
    MatTooltipModule,
  ],
  templateUrl: './view-transaction-details.component.html',
  styleUrl: './view-transaction-details.component.scss',
})
export class ViewTransactionDetailsComponent {
  private readonly _platformDetectorService = inject(PlatformDetectorService);
  readonly transactionTypeEnum = TransactionTypeEnum;
  private readonly _userServuce = inject(UserService);
  private readonly _transactionService = inject(TransactionService);
  private readonly _translateService = inject(TranslateService);
  private readonly _toastMessageService = inject(ToastMessageService);
  private readonly _clipBoard = inject(Clipboard);
  private readonly _router = inject(Router);
  isSubmitting = signal(false);

  isLoading = computed(() => this.isSubmitting());

  constructor(
    @Inject(MAT_DIALOG_DATA) public transaction: ITransaction,
    private readonly _dialogRef: MatDialogRef<ViewTransactionDetailsComponent>
  ) {}

  get isPlatformMobile() {
    return this._platformDetectorService.isPlaformMobile;
  }

  close(reload: boolean = false) {
    this._dialogRef.close(reload);
  }

  shouldVisible() {
    return this._userServuce.User()?.roles.includes(Role.Admin);
  }

  updateStatus() {
    if (!this.transaction?.id) return;
    const succesMessage = this._translateService.instant(
      ErrorMessageConst.TRANSACTION_APPROVED
    );
    const failedMessage = this._translateService.instant(
      ErrorMessageConst.SOMETHING_WENT_WRONG
    );
    this.isSubmitting.set(false);
    this._transactionService
      .updateStatus(this.transaction.id)
      .pipe(
        map((res) => res?.success),
        catchError((err) => of(false)),
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe((res) => {
        if (res) {
          this._toastMessageService.showSuccess(succesMessage);
          this.close(true);
        } else {
          this._toastMessageService.showFailed(failedMessage);
        }
      });
  }

  copyToClipBoard(value: string) {
    this._clipBoard.copy(value);
  }

  async gotToDpsDetails() {
    await this._router.navigate(['dps', this.transaction.dpsId]);
    this.close(false);
  }
}
