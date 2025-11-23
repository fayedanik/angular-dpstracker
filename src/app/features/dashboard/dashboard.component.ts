import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BankAccountService } from '../../core/services/bank-account.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { DpsService } from '../../core/services/dps.service';
import { TransactionService } from '../../core/services/transaction.service';
import { UserService } from '../../core/services/user.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { NoDataViewComponent } from '../../shared/components/no-data-view/no-data-view.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import {
  bankAccountTypeEnum,
  TransactionTypeEnum,
} from '../../shared/consts/business.const';
import { AppLottie } from '../../shared/directives/app-lottie.directive';
import { IDps, IDpsOwner } from '../../shared/interfaces/dps.interface';
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
    ProgressSpinnerComponent,
    MatDividerModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly _userService = inject(UserService);
  private readonly _bankAccountService = inject(BankAccountService);
  private readonly _transactionService = inject(TransactionService);
  private readonly _dpsService = inject(DpsService);
  private readonly _dashboardService = inject(DashboardService);
  private readonly _transactionListResponse =
    this._transactionService.getTransactions(
      signal({ type: '', pageIndex: 0, pageLimit: 5 })
    );
  private readonly _bankAccountListResponse =
    this._bankAccountService.getAccounts();
  private readonly _dpsListResponse = this._dpsService.getDpsList();
  private readonly _dashboardStats = this._dashboardService.getDashboardStats();

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

  dashboardStats = computed(() => {
    return this._dashboardStats.hasValue() && this._dashboardStats.value().data
      ? this._dashboardStats.value().data?.accounts
      : [];
  });

  jointAccounts = computed(() => {
    return (this.bankAccounts() || []).filter(
      (account) => account.accountType == bankAccountTypeEnum.Joint
    );
  });

  personalAccounts = computed(() => {
    return (this.bankAccounts() || []).find(
      (account) => account.accountType == bankAccountTypeEnum.Personal
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

  getUserDpsLastPayment(dps: IDps) {
    const user = this._userService.User();
    if (!user) return null;
    return (dps.dpsOwners || [])
      .find((x) => x.userId == user.id)
      ?.installmentDates.sort((a, b) => (new Date(a) < new Date(b) ? 1 : -1))
      .at(0);
  }

  getTotalInstallmentsPercentageAmount(dps: IDps) {
    return (
      ((dps.totalDeposit ?? 0) / (dps.monthlyAmount * dps.durationMonths)) * 100
    );
  }

  getUserInstallmenetsPercentageAmount(dps: IDps) {
    return (
      ((this.getUserCurrentBalance(dps) ?? 0) /
        (Math.ceil(dps.monthlyAmount / (dps.dpsOwners.length ?? 1)) *
          dps.durationMonths)) *
      100
    );
  }

  getDpsListByAccountId(accountNo: string) {
    return this.dpsList()?.filter((x) => x.accountNo == accountNo);
  }

  getPersonalShare(id: string) {
    return this.dashboardStats()?.find((x) => x.id == id)?.amountShare ?? 0;
  }

  getNumberOfInstallmentMissing(dps: IDps) {
    const installmentPaids = (dps.installmentDates || []).length;
    const stDate = new Date(dps.startDate);
    const endDate =
      new Date() > new Date(dps.maturityDate)
        ? new Date(dps.maturityDate)
        : new Date();
    const totalInstallMents =
      (endDate.getFullYear() - stDate.getFullYear()) * 12 +
      (endDate.getMonth() - stDate.getMonth());
    return totalInstallMents - installmentPaids;
  }

  getOwnerInstallmentMissing(owner: IDpsOwner, dps: IDps) {
    return (
      dps.installmentDates.length +
      this.getNumberOfInstallmentMissing(dps) -
      owner.installmentDates.length
    );
  }
}
