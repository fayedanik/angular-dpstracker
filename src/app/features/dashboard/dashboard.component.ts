import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BankAccountService } from '../../core/services/bank-account.service';
import { DpsService } from '../../core/services/dps.service';
import { TransactionService } from '../../core/services/transaction.service';
import { UserService } from '../../core/services/user.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { NoDataViewComponent } from '../../shared/components/no-data-view/no-data-view.component';
import {
  bankAccountTypeEnum,
  TransactionTypeEnum,
} from '../../shared/consts/business.const';
import { AppLottie } from '../../shared/directives/app-lottie.directive';
import { IDps } from '../../shared/interfaces/dps.interface';
import { TakaPipe } from '../../shared/pipes/taka-currency.pipe';
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    AppLottie,
    MatIconModule,
    AvatarComponent,
    TakaPipe,
    NoDataViewComponent,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly _userService = inject(UserService);
  private readonly _bankAccountService = inject(BankAccountService);
  private readonly _transactionService = inject(TransactionService);
  private readonly _dpsService = inject(DpsService);
  private readonly _transactionListResponse =
    this._transactionService.getTransactions(
      signal({ type: '', pageIndex: 0, pageLimit: 5 })
    );
  private readonly _bankAccountListResponse =
    this._bankAccountService.getAccounts();
  private readonly _dpsListResponse = this._dpsService.getDpsList();
  private readonly _router = inject(Router);

  readonly transactionTypeEnum = TransactionTypeEnum;

  transactions = computed(() => {
    return this._transactionListResponse.hasValue() &&
      (this._transactionListResponse.value().data || []).length > 0
      ? this._transactionListResponse.value().data
      : [];
  });

  bankAccounts = computed(() => {
    return this._bankAccountListResponse.hasValue() &&
      (this._bankAccountListResponse.value().data || []).length > 0
      ? this._bankAccountListResponse.value().data
      : [];
  });

  dpsList = computed(() => {
    return this._dpsListResponse.hasValue() &&
      (this._dpsListResponse.value().data || []).length > 0
      ? this._dpsListResponse.value().data
      : [];
  });

  jointAccount = computed(() => {
    return (this.bankAccounts() || []).find(
      (account) => account.accountType == bankAccountTypeEnum.Joint
    );
  });

  constructor() {}

  gotoTransaction() {
    this._router.navigate(['transactions']);
  }

  getTotalDeposit(dps: IDps) {
    return (dps.dpsOwners || []).reduce(
      (curr, bal) => curr + (bal.amountPaid ?? 0),
      0
    );
  }

  getUserCurrentBalance(dps: IDps) {
    const user = this._userService.User();
    if (!user) return 0;
    return (
      (dps.dpsOwners || []).find((x) => x.userId == user.id)?.amountPaid ?? 0
    );
  }

  getTotalInstallmentsPercentageAmount(dps: IDps) {
    return (
      ((this.getTotalDeposit(dps) ?? 0) /
        (dps.monthlyAmount * dps.durationMonths * dps.dpsOwners.length)) *
      100
    );
  }

  getUserInstallmenetsPercentageAmount(dps: IDps) {
    return (
      ((this.getUserCurrentBalance(dps) ?? 0) /
        (dps.monthlyAmount * dps.durationMonths * dps.dpsOwners.length)) *
      100
    );
  }
}
