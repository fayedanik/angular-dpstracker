import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Inject,
  OnInit,
  PLATFORM_ID,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import {
  ActivateEvent,
  DatatableComponent,
  NgxDatatableModule,
  TableColumn,
} from '@swimlane/ngx-datatable';
import { DpsService } from '../../core/services/dps.service';
import { TransactionService } from '../../core/services/transaction.service';
import { UserService } from '../../core/services/user.service';
import {
  accountType,
  Role,
  TransactionTypeEnum,
} from '../../shared/consts/business.const';
import { AppAllowedForDirectivce } from '../../shared/directives/allowed-for.directive';
import { IGetTransactionQueryPayload } from '../../shared/interfaces/get-transaction-query.payload.interface';
import { ITransaction } from '../../shared/interfaces/transaction.interface';
import { DialogRootService } from '../../shared/services/dialog-root.service';
import { PlatformDetectorService } from '../../shared/services/platform-detector.service';
import { ToastMessageService } from '../../shared/services/toast-message.service';
import { AddTransactionComponent } from './components/add-transaction/add-transaction.component';
import { ViewTransactionDetailsComponent } from './components/view-transaction-details/view-transaction-details.component';
@Component({
  selector: 'app-transactions',
  imports: [
    MatButtonModule,
    MatIconModule,
    NgxDatatableModule,
    CommonModule,
    MatTabsModule,
    AppAllowedForDirectivce,
    MatPaginatorModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  @ViewChild('transferMoneyTable', { static: true })
  transferMoneyTable!: DatatableComponent<ITransaction>;
  @ViewChild('paymentListTable', { static: true })
  paymentListTable!: DatatableComponent<ITransaction>;
  @ViewChild('statusCellTemplate', { static: true })
  statusCellTemplate!: TemplateRef<any>;
  @ViewChild('transactionDateCellTemplate', { static: true })
  transactionDateCellTemplate!: TemplateRef<any>;
  @ViewChild('dpsCellTemplate', { static: true })
  dpsCellTemplate!: TemplateRef<any>;
  @ViewChild('paymentTypeCellTemplate', { static: true })
  paymentTypeCellTemplate!: TemplateRef<any>;
  @ViewChild('senderDisplayNameCellTemplate', { static: true })
  senderDisplayNameCellTemplate!: TemplateRef<any>;

  private readonly _bottomSheet = inject(MatBottomSheet);
  private readonly _platformDetectorService = inject(PlatformDetectorService);
  private readonly _dialogRootService = inject(DialogRootService);
  private readonly _translateService = inject(TranslateService);
  private readonly _toastMessageService = inject(ToastMessageService);
  private readonly _dpsService = inject(DpsService);
  private readonly _transactionService = inject(TransactionService);
  private readonly _transferMoneyTransactionQueryPayload =
    signal<IGetTransactionQueryPayload>({
      type: TransactionTypeEnum.TransferMoney.toString(),
      pageIndex: 0,
      pageLimit: 10,
    });
  private readonly _paymentTransactionQueryPayload =
    signal<IGetTransactionQueryPayload>({
      type: TransactionTypeEnum.Payment.toString(),
      pageIndex: 0,
      pageLimit: 10,
    });
  private readonly _transferMoneyTrasnactionsResponse =
    this._transactionService.getTransactions(
      this._transferMoneyTransactionQueryPayload
    );
  private readonly _paymentTrasnactionsResponse =
    this._transactionService.getTransactions(
      this._paymentTransactionQueryPayload
    );
  private readonly _dpsListResponse = this._dpsService.getDpsList();
  private readonly _userServuce = inject(UserService);

  tranferMoneyPageLimit = () =>
    this._transferMoneyTransactionQueryPayload().pageLimit;
  transferMoneyTransactions = computed(() => {
    return this._transferMoneyTrasnactionsResponse.hasValue()
      ? this._transferMoneyTrasnactionsResponse.value()
      : null;
  });

  paymentPageLimit = () => this._paymentTransactionQueryPayload().pageLimit;
  paymentTransactions = computed(() => {
    return this._paymentTrasnactionsResponse.hasValue()
      ? this._paymentTrasnactionsResponse.value()
      : null;
  });

  dpsList = computed(() => {
    return this._dpsListResponse.hasValue() &&
      (this._dpsListResponse.value().data || []).length > 0
      ? this._dpsListResponse.value().data
      : [];
  });

  transferMoneyColumns: TableColumn[] = [];

  paymentColumns: TableColumn[] = [];

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
        name: 'Sender Name',
        prop: 'senderDisplayName',
        width: 150,
        sortable: false,
        cellTemplate: this.senderDisplayNameCellTemplate,
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
      // {
      //   name: 'Note',
      //   prop: 'note',
      //   sortable: false,
      //   width: 200,
      // },
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
        name: 'Sender Name',
        prop: 'senderDisplayName',
        width: 150,
        sortable: false,
        cellTemplate: this.senderDisplayNameCellTemplate,
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
      // {
      //   name: 'Note',
      //   prop: 'note',
      //   sortable: false,
      //   width: 200,
      // },
      {
        name: 'Status',
        prop: 'status',
        sortable: false,
        width: 100,
        cellTemplate: this.statusCellTemplate,
      },
    ];
  }

  openCreateTransactionDialog(data: { isTransfer: boolean }) {
    if (this._platformDetectorService.isPlaformMobile) {
      this._bottomSheet
        .open(AddTransactionComponent, {
          data: data,
        })
        .afterDismissed()
        .subscribe((res) => {
          if (res) {
            this.reloadDataTable(data.isTransfer);
          }
        });
    } else {
      this._dialogRootService
        .openDialog(AddTransactionComponent, { data: data })
        .afterClosed()
        .subscribe((res) => {
          if (res) {
            this.reloadDataTable(data.isTransfer);
          }
        });
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

  onClickRow(event: ActivateEvent<ITransaction>) {
    if (event.type == 'click') {
      this._dialogRootService
        .openDialog(ViewTransactionDetailsComponent, {
          data: {
            ...event.row,
            dpsName: this.getDpsInfo(event.row?.dpsId),
          },
        })
        .afterClosed()
        .subscribe((res) => {
          if (!res) return;
          this.reloadDataTable(
            event.row.transactionType == TransactionTypeEnum.TransferMoney
          );
        });
    }
  }

  reloadDataTable(isTransferMoney: boolean) {
    if (isTransferMoney) {
      setTimeout(() => {
        const reloaded = this._transferMoneyTrasnactionsResponse.reload();
        if (reloaded) this.transferMoneyTable.recalculate();
      });
    } else {
      setTimeout(() => {
        const reloaded = this._paymentTrasnactionsResponse.reload();
        if (reloaded) this.paymentListTable.recalculate();
      });
    }
  }

  changeTransferMoneyPage(event: PageEvent) {
    this._transferMoneyTransactionQueryPayload.update((x) => ({
      ...x,
      pageIndex: event.pageIndex + 1,
    }));
  }

  changePaymentPage(event: PageEvent) {
    this._paymentTransactionQueryPayload.update((x) => ({
      ...x,
      pageIndex: event.pageIndex + 1,
    }));
  }
}
