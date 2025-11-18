import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { catchError, map, of } from 'rxjs';
import { TransactionService } from '../../../../core/services/transaction.service';
import { UserService } from '../../../../core/services/user.service';
import {
  Role,
  TransactionTypeEnum,
} from '../../../../shared/consts/business.const';
import { ErrorMessageConst } from '../../../../shared/consts/errorMessage.const';
import { ITransaction } from '../../../../shared/interfaces/transaction.interface';
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
    this._transactionService
      .updateStatus(this.transaction.id)
      .pipe(
        map((res) => res?.success),
        catchError((err) => of(false))
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
}
