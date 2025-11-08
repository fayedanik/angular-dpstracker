import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Inject,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { NgxDatatableModule, TableColumn } from '@swimlane/ngx-datatable';
import { DpsService } from '../../core/services/dps.service';
import { TransactionService } from '../../core/services/transaction.service';
import { UserService } from '../../core/services/user.service';
import {
  accountType,
  Role,
  TransactionTypeEnum,
} from '../../shared/consts/business.const';
import { AppAllowedForDirectivce } from '../../shared/directives/allowed-for.directive';
import { DialogRootService } from '../../shared/services/dialog-root.service';
import { PlatformDetectorService } from '../../shared/services/platform-detector.service';
import { ToastMessageService } from '../../shared/services/toast-message.service';
import { AddTransactionComponent } from './components/add-transaction/add-transaction.component';
@Component({
  selector: 'app-transactions',
  imports: [
    MatButtonModule,
    MatIconModule,
    NgxDatatableModule,
    CommonModule,
    MatTabsModule,
    AppAllowedForDirectivce,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  @ViewChild('statusCellTemplate', { static: true })
  statusCellTemplate!: TemplateRef<any>;
  @ViewChild('transactionDateCellTemplate', { static: true })
  transactionDateCellTemplate!: TemplateRef<any>;
  @ViewChild('dpsCellTemplate', { static: true })
  dpsCellTemplate!: TemplateRef<any>;
  @ViewChild('paymentTypeCellTemplate', { static: true })
  paymentTypeCellTemplate!: TemplateRef<any>;

  private readonly _bottomSheet = inject(MatBottomSheet);
  private readonly _platformDetectorService = inject(PlatformDetectorService);
  private readonly _dialogRootService = inject(DialogRootService);
  private readonly _translateService = inject(TranslateService);
  private readonly _toastMessageService = inject(ToastMessageService);
  private readonly _dpsService = inject(DpsService);
  private readonly _transactionService = inject(TransactionService);
  private readonly _transactionListResponse =
    this._transactionService.getTransactions();
  private readonly _dpsListResponse = this._dpsService.getDpsList();
  private readonly _userServuce = inject(UserService);

  transactions = computed(() => {
    return this._transactionListResponse.hasValue() &&
      (this._transactionListResponse.value().data || []).length > 0
      ? this._transactionListResponse.value().data
      : [];
  });

  dpsList = computed(() => {
    return this._dpsListResponse.hasValue() &&
      (this._dpsListResponse.value().data || []).length > 0
      ? this._dpsListResponse.value().data
      : [];
  });

  transferMoneyColumns: TableColumn[] = [];
  transferMoneyTransactions = computed(() => {
    return this.transactions()?.filter(
      (x) => x.transactionType == TransactionTypeEnum.TransferMoney.toString()
    );
  });

  paymentColumns: TableColumn[] = [];
  paymentTransactions = computed(() => {
    return this.transactions()?.filter(
      (x) => x.transactionType == TransactionTypeEnum.Payment.toString()
    );
  });

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngOnInit(): void {
    this.initDataTable();
  }

  readonly accountType = accountType;

  get isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  private initDataTable() {
    this.transferMoneyColumns = [
      {
        name: 'Source A/C',
        prop: 'sourceAc',
        width: 150,
        sortable: false,
      },
      {
        name: 'Beneficiary A/C',
        prop: 'destAc',
        width: 150,
        sortable: false,
      },
      {
        name: 'Amount',
        prop: 'amount',
        width: 100,
      },
      {
        name: 'Transfer Date',
        prop: 'transactionDate',
        sortable: false,
        width: 150,
        cellTemplate: this.transactionDateCellTemplate,
      },
      {
        name: 'Transaction ID',
        prop: 'transactionNo',
        sortable: false,
        width: 200,
      },
      {
        name: 'Note',
        prop: 'note',
        sortable: false,
        width: 200,
      },
      {
        name: 'Status',
        prop: 'status',
        sortable: false,
        width: 100,
        cellTemplate: this.statusCellTemplate,
      },
    ];

    this.paymentColumns = [
      {
        name: 'Source A/C',
        prop: 'sourceAc',
        width: 150,
        sortable: false,
      },
      {
        name: 'Payment Type',
        prop: 'paymentType',
        width: 100,
        sortable: false,
        cellTemplate: this.paymentTypeCellTemplate,
      },
      {
        name: 'Dps',
        prop: 'dpsId',
        width: 150,
        sortable: false,
        cellTemplate: this.dpsCellTemplate,
      },
      {
        name: 'Amount',
        prop: 'amount',
        width: 100,
      },
      {
        name: 'Transfer Date',
        prop: 'transactionDate',
        sortable: false,
        width: 150,
        cellTemplate: this.transactionDateCellTemplate,
      },
      {
        name: 'Transaction ID',
        prop: 'transactionNo',
        sortable: false,
        width: 150,
      },
      {
        name: 'Note',
        prop: 'note',
        sortable: false,
        width: 200,
      },
      {
        name: 'Status',
        prop: 'status',
        sortable: false,
        width: 100,
        cellTemplate: this.statusCellTemplate,
      },
    ];
  }

  openCreateTransactionDialog(data?: any) {
    if (this._platformDetectorService.isPlaformMobile) {
      this._bottomSheet
        .open(AddTransactionComponent, {
          data: data,
        })
        .afterDismissed()
        .subscribe(() => {});
    } else {
      this._dialogRootService
        .openDialog(AddTransactionComponent, { data: data })
        .afterClosed()
        .subscribe(() => {});
    }
  }

  getDpsInfo(dpsId: string) {
    if (!dpsId || (this.dpsList() || []).length == 0) return '-';
    else {
      return this.dpsList()?.find((x) => x.id == dpsId)?.dpsName;
    }
  }

  shouldHide() {
    return this._userServuce.User()?.roles.includes(Role.Admin);
  }
}
