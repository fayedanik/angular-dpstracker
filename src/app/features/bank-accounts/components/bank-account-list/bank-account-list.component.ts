import { CommonModule } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PlatformDetectorService } from '../../../../shared/services/platform-detector.service';
import { AddBankAccountComponent } from '../add-bank-account/add-bank-account.component';
@Component({
  selector: 'app-bank-account-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    NgxDatatableModule,
    CommonModule,
    TranslatePipe,
    MatBottomSheetModule,
  ],
  templateUrl: './bank-account-list.component.html',
  styleUrl: './bank-account-list.component.scss',
})
export class BankAccountListComponent {
  private readonly _dialog = inject(MatDialog);
  private readonly _bottomSheet = inject(MatBottomSheet);
  private readonly _platformDetectorService = inject(PlatformDetectorService);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  addBankAccount() {
    if (this._platformDetectorService.isPlatformWeb) {
      this._dialog.open(AddBankAccountComponent, {
        width: '400px',
        maxWidth: '400px',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '200ms',
      });
    } else {
      this._bottomSheet.open(AddBankAccountComponent);
    }
  }
}
