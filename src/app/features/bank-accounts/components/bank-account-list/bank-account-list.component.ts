import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  Inject,
  inject,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { catchError, debounceTime, of, tap } from 'rxjs';
import { BankAccountService } from '../../../../core/services/bank-account.service';
import { UserService } from '../../../../core/services/user.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';
import { ErrorMessageConst } from '../../../../shared/consts/errorMessage.const';
import { IAddUpdateBankAccountPayload } from '../../../../shared/interfaces/add-bank-account-payload.interface';
import { IBankAccount } from '../../../../shared/interfaces/bank-account.interface';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { DialogRootService } from '../../../../shared/services/dialog-root.service';
import { PlatformDetectorService } from '../../../../shared/services/platform-detector.service';
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
import { AddBankAccountComponent } from '../add-bank-account/add-bank-account.component';
import { BankAccountCardComponent } from '../bank-account-card/bank-account-card.component';
@Component({
  selector: 'app-bank-account-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    NgxDatatableModule,
    CommonModule,
    TranslatePipe,
    MatBottomSheetModule,
    MatTooltipModule,
    MatSidenavModule,
    MatFormFieldModule,
    MaterialModule,
    MatInputModule,
    AvatarComponent,
    MatListModule,
    MatProgressSpinnerModule,
    BankAccountCardComponent,
  ],
  templateUrl: './bank-account-list.component.html',
  styleUrl: './bank-account-list.component.scss',
})
export class BankAccountListComponent {
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;

  searchControl = new FormControl('');

  selectedMembers: FormControl<string[] | null> = new FormControl([]);

  $searchStream = this.searchControl.valueChanges.pipe(debounceTime(300));

  private readonly _bankAccountSerice = inject(BankAccountService);
  private readonly _bottomSheet = inject(MatBottomSheet);
  private readonly _platformDetectorService = inject(PlatformDetectorService);
  private readonly _accountListResponse = this._bankAccountSerice.getAccounts();
  private readonly _dialogRootService = inject(DialogRootService);
  private readonly _translateService = inject(TranslateService);
  private readonly _toastMessageService = inject(ToastMessageService);
  private readonly _userService = inject(UserService);
  private readonly _searchSignal = toSignal(this.$searchStream, {
    initialValue: this.searchControl.value ?? '',
  });
  private readonly _selectedAccount = signal<IBankAccount | null>(null);

  userList = this._userService.getAllUsers(this._searchSignal);

  members = computed(() => {
    const users = this.userList.hasValue()
      ? this.userList.value().data?.users ?? []
      : [];
    return users;
  });

  accountList = computed(() => {
    return this._accountListResponse.hasValue() &&
      (this._accountListResponse.value().data || []).length > 0
      ? this._accountListResponse.value().data
      : [];
  });
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  updateBankAccount(data?: IBankAccount) {
    if (this._platformDetectorService.isPlaformMobile) {
      this._bottomSheet
        .open(AddBankAccountComponent, {
          data: {
            account: data,
          },
        })
        .afterDismissed()
        .subscribe(() => {
          this._accountListResponse.reload();
        });
    } else {
      this._dialogRootService
        .openDialog(AddBankAccountComponent, { data: { account: data } })
        .afterClosed()
        .subscribe(() => {
          this._accountListResponse.reload();
        });
    }
  }

  deleteBankAccount(data: IBankAccount) {
    this._dialogRootService
      .openDialog(ConfirmationModalComponent)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this._bankAccountSerice
            .deleteBankAccount({ id: data.id })
            .subscribe((res) => {
              if (res?.success) this._accountListResponse.reload();
            });
        }
      });
  }

  openDrawer(account: IBankAccount) {
    this._selectedAccount.set(account);
    this.selectedMembers.setValue(account.accountHolders.map((x) => x.userId));
    this.drawer.open();
  }

  get selectedMembersValue() {
    return this.selectedMembers.value;
  }

  addMember() {
    if (
      !this._selectedAccount ||
      !this.selectedMembersValue ||
      this.selectedMembersValue.length == 0
    )
      return;
    const succesMessage = this._translateService.instant(
      ErrorMessageConst.MEMBER_ADDED
    );
    const failedMessage = this._translateService.instant(
      ErrorMessageConst.SOMETHING_WENT_WRONG
    );
    this._bankAccountSerice
      .updateBankAccount({
        id: this._selectedAccount()?.id,
        accountType: this._selectedAccount()?.accountType,
        userIds: this.selectedMembersValue,
      } as IAddUpdateBankAccountPayload)
      .pipe(
        tap(async (res) => {
          if (res?.success) {
            this._accountListResponse.reload();
            await this.drawer.close();
            this._toastMessageService.showSuccess(succesMessage);
          } else {
            this._toastMessageService.showFailed(failedMessage);
          }
        }),
        catchError((err) => {
          this._toastMessageService.showFailed(failedMessage);
          return of(false);
        })
      )
      .subscribe();
  }
}
