import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  Inject,
  inject,
  OnInit,
  Optional,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { catchError, finalize, of, tap } from 'rxjs';
import { BankAccountService } from '../../../../core/services/bank-account.service';
import { UserService } from '../../../../core/services/user.service';
import {
  accountType,
  bankAccountTypeEnum,
  Role,
} from '../../../../shared/consts/business.const';
import { ErrorMessageConst } from '../../../../shared/consts/errorMessage.const';
import { DigitsOnlyDirective } from '../../../../shared/directives/digits-only.directive';
import { IAddUpdateBankAccountPayload } from '../../../../shared/interfaces/add-bank-account-payload.interface';
import { IBankAccount } from '../../../../shared/interfaces/bank-account.interface';
import {
  IBankInfo,
  IBranchInfo,
} from '../../../../shared/interfaces/bank-list-response.interface';
import { PlatformDetectorService } from '../../../../shared/services/platform-detector.service';
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
@Component({
  selector: 'app-add-bank-account',
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    TranslatePipe,
    MatSelectModule,
    MatBottomSheetModule,
    DigitsOnlyDirective,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './add-bank-account.component.html',
  styleUrl: './add-bank-account.component.scss',
})
export class AddBankAccountComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _bankAccountSerice = inject(BankAccountService);
  private readonly _bankList = this._bankAccountSerice.getBankList();
  private readonly _selectedBank = signal<IBankInfo | null>(null);
  private readonly _platformDetectorService = inject(PlatformDetectorService);
  private readonly _toastMessageService = inject(ToastMessageService);
  private readonly _translateService = inject(TranslateService);

  constructor(
    @Optional()
    private readonly _dialogRef: MatDialogRef<AddBankAccountComponent>,
    @Optional()
    private readonly _bottomSheetRef: MatBottomSheetRef<AddBankAccountComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    private readonly _dialogData: { account: IBankAccount },
    @Optional()
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private readonly _bottomSheetData: { account: IBankAccount }
  ) {
    effect(() => {
      if (this.bankList()) {
        const account =
          this._dialogData?.account ?? this._bottomSheetData?.account;
        if (!account) return;
        const bank = this.bankList().find((x) => x.bank_code == account.bankId);
        if (bank && this.addBankAccountForm) {
          this.addBankAccountForm.controls.bank.setValue(bank);
          this.selectBank(bank);
          const branch = bank.districts
            .map((dist) => dist.branches)
            .flat(1)
            .find((p) => p.routing_number === account.branchId);
          if (branch) {
            this.addBankAccountForm.controls.branch.setValue(branch);
          }
        }
      }
    });
  }

  readonly accountType = accountType;
  readonly accountTypeEnum = bankAccountTypeEnum;

  isSubmitting = signal(false);
  isLoading = computed(() => this.isSubmitting() || this._bankList.isLoading());

  user = inject(UserService).User;

  bankList = computed(() => {
    const banks = this._bankList.hasValue() ? this._bankList.value() : [];
    return banks;
  });

  branchList = computed(() => {
    const selectedBank = this._selectedBank();
    if (selectedBank == null) return [];
    const banks = this._bankList.hasValue() ? this._bankList.value() : [];
    const branches = banks
      .find((bank) => bank.bank_code == selectedBank.bank_code)
      ?.districts.map((dist) => dist.branches)
      .flat(1)
      .sort((a, b) => a.branch_name.localeCompare(b.branch_name));
    return branches;
  });

  addBankAccountForm!: FormGroup<AddAccountForm>;

  private initForm() {
    this.addBankAccountForm = this._fb.group<AddAccountForm>({
      accountNo: this._fb.control('', { validators: [Validators.required] }),
      bank: this._fb.control(null, { validators: [Validators.required] }),
      branch: this._fb.control(
        { value: null, disabled: true },
        { validators: [Validators.required] }
      ),
      accountType: this._fb.control('', {
        validators: [Validators.required],
      }),
      availableBalance: this._fb.control(null, {
        validators: [],
      }),
    });
  }

  private populateAccountDataToForm(account: IBankAccount) {
    if (account.accountNo)
      this.addBankAccountForm.controls.accountNo.setValue(account.accountNo);
    if (account.accountType)
      this.addBankAccountForm.controls.accountType.setValue(
        account.accountType
      );
    // this.addBankAccountForm.controls.availableBalance.setValue(
    //   account?.balance ?? 0
    // );
  }

  addUpdateTransaction() {
    if (this.addBankAccountForm.invalid) return;
    const succesMessage = this.isUpdate
      ? this._translateService.instant(ErrorMessageConst.ACCOUNT_UPDATED)
      : this._translateService.instant(ErrorMessageConst.ACCOUNT_ADDED);
    const failedMessage = this._translateService.instant(
      ErrorMessageConst.SOMETHING_WENT_WRONG
    );
    const payload = this.getPayloadForAddUpdateAccount();
    this.isSubmitting.set(true);
    this.bindCall(payload)
      .pipe(
        tap((res) => {
          if (res.success) {
            this._toastMessageService.showSuccess(succesMessage);
            this.close(true);
          } else {
            this._toastMessageService.showFailed(failedMessage);
          }
        }),
        catchError((err) => {
          this._toastMessageService.showFailed(failedMessage);
          return of(null);
        }),
        finalize(() => {
          this.isSubmitting.set(false);
        })
      )
      .subscribe();
  }

  getPayloadForAddUpdateAccount() {
    const formValue = this.addBankAccountForm.getRawValue();
    return {
      id: this._dialogData?.account?.id ?? this._bottomSheetData?.account?.id,
      accountNo: formValue?.accountNo ?? '',
      bankId: formValue?.bank?.bank_code ?? '',
      bankName: formValue?.bank?.name ?? '',
      branchId: formValue?.branch?.routing_number ?? '',
      branchName: formValue?.branch?.branch_name ?? '',
      accountType: formValue?.accountType ?? '',
      userIds: [],
      balance: Number(formValue?.availableBalance ?? 0),
    } as IAddUpdateBankAccountPayload;
  }

  bindCall(payload: IAddUpdateBankAccountPayload) {
    return this.isUpdate
      ? this._bankAccountSerice.updateBankAccount(payload)
      : this._bankAccountSerice.addBankAccount(payload);
  }

  selectBank(event: IBankInfo) {
    this._selectedBank.set(event);
    this.addBankAccountForm.controls.branch.reset();
    this.addBankAccountForm.controls.branch.enable();
  }

  get isPlatformMobile() {
    return this._platformDetectorService.isPlaformMobile;
  }

  close(success: boolean = false) {
    if (this._dialogRef) this._dialogRef.close(success);
    else if (this._bottomSheetRef) this._bottomSheetRef.dismiss(success);
  }

  ngOnInit(): void {
    this.initForm();
    if (this._dialogData?.account) {
      this.populateAccountDataToForm(this._dialogData.account);
    } else if (this._bottomSheetData?.account) {
      this.populateAccountDataToForm(this._bottomSheetData.account);
    }
  }

  get isUpdate() {
    return this._dialogData?.account || this._bottomSheetData?.account;
  }

  get selectedAccountType() {
    return this.addBankAccountForm.controls.accountType.value;
  }

  get isAdmin() {
    return this.user()?.roles.includes(Role.Admin);
  }
}

interface AddAccountForm {
  accountNo: FormControl<string | null>;
  bank: FormControl<IBankInfo | null>;
  branch: FormControl<IBranchInfo | null>;
  accountType: FormControl<string | null>;
  availableBalance: FormControl<number | null>;
}
