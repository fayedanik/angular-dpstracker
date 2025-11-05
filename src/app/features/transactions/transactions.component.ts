import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { accountType } from '../../shared/consts/business.const';
import { DialogRootService } from '../../shared/services/dialog-root.service';
import { PlatformDetectorService } from '../../shared/services/platform-detector.service';
import { ToastMessageService } from '../../shared/services/toast-message.service';
import { AddTransactionComponent } from './components/add-transaction/add-transaction.component';
@Component({
  selector: 'app-transactions',
  imports: [MatButtonModule, MatIconModule, NgxDatatableModule, CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  private readonly _bottomSheet = inject(MatBottomSheet);
  private readonly _platformDetectorService = inject(PlatformDetectorService);
  private readonly _dialogRootService = inject(DialogRootService);
  private readonly _translateService = inject(TranslateService);
  private readonly _toastMessageService = inject(ToastMessageService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];
  columns = [
    { name: 'A/C No.', prop: 'name' },
    { name: 'Bank Name', prop: 'gender' },
    { name: 'Transaction No.', prop: 'company' },
  ];

  readonly accountType = accountType;

  get isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
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
}
