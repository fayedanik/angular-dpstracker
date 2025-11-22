import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  Inject,
  inject,
  OnInit,
  Optional,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { catchError, finalize, map, of } from 'rxjs';
import { BankAccountService } from '../../../../core/services/bank-account.service';
import { DpsService } from '../../../../core/services/dps.service';
import { TransactionService } from '../../../../core/services/transaction.service';
import {
  accountType,
  paymentType,
} from '../../../../shared/consts/business.const';
import { ErrorMessageConst } from '../../../../shared/consts/errorMessage.const';
import { DigitsOnlyDirective } from '../../../../shared/directives/digits-only.directive';
import { IDps } from '../../../../shared/interfaces/dps.interface';
import { IMakePaymentPayload } from '../../../../shared/interfaces/make-payment-payload.interface';
import { ITransferMoneyPayload } from '../../../../shared/interfaces/transfer-money-payload.interface';
import { PlatformDetectorService } from '../../../../shared/services/platform-detector.service';
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
import { normalizeDateToUTC } from '../../../../shared/utils/date-utils';

@Component({
  selector: 'app-add-transaction',
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    TranslatePipe,
    MatDatepickerModule,
    DigitsOnlyDirective,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss',
})
export class AddTransactionComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _bankAccountSerice = inject(BankAccountService);
  private readonly _accountListResponse = this._bankAccountSerice.getAccounts();
  private readonly _platformDetectorService = inject(PlatformDetectorService);
  private readonly _dpsService = inject(DpsService);
  private readonly _dpsListResponse = this._dpsService.getDpsList();
  private readonly _transactionService = inject(TransactionService);
  private readonly _translateService = inject(TranslateService);
  private readonly _toastMessageService = inject(ToastMessageService);
  private readonly _destroyRef = inject(DestroyRef);

  todayDate = new Date();

  dpsList = computed(() => {
    return this._dpsListResponse.hasValue() &&
      (this._dpsListResponse.value().data || []).length > 0
      ? this._dpsListResponse.value().data
      : [];
  });

  dpsListByAccountNo: IDps[] = [];

  constructor(
    @Optional()
    private readonly _dialogRef: MatDialogRef<AddTransactionComponent>,
    @Optional()
    private readonly _bottomSheetRef: MatBottomSheetRef<AddTransactionComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    private readonly _dialogData: { isTransfer: boolean },
    @Optional()
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private readonly _bottomSheetData: { isTransfer: boolean }
  ) {}

  addTransactionForm!: FormGroup<AddTransactionForm>;

  readonly paymentTypeOptions = paymentType;

  isSubmitting = signal(false);

  isLoading = computed(
    () =>
      this.isSubmitting() ||
      this._dpsListResponse.isLoading() ||
      this._accountListResponse.isLoading()
  );

  ngOnInit(): void {
    this.initForm();
    this.addTransactionForm.controls.paymentType.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((type) => {
        const ctrl = this.addTransactionForm.controls.dpsId;
        if (type == 'dps') {
          ctrl.addValidators(Validators.required);
        } else {
          ctrl.setValue(null);
          ctrl.clearValidators();
        }
        ctrl.updateValueAndValidity();
      });
    this.addTransactionForm.controls.dpsId.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((dpsId) => {
        const dps = this.dpsList()?.find((x) => x.id == dpsId);
        if (!dps) return;
        this.addTransactionForm.controls.amount.setValue(dps.monthlyAmount);
        this.addTransactionForm.controls.amount.disable();
      });
  }

  private initForm() {
    this.addTransactionForm = this._fb.group<AddTransactionForm>({
      accountNo: this._fb.control('', [Validators.required]),
      transactionNumber: this._fb.control('', [Validators.required]),
      amount: this._fb.control(null, [Validators.required]),
      benificiaryAccountNumber: this._fb.control('', [Validators.required]),
      date: this._fb.control(null, [Validators.required]),
      paymentType: this._fb.control('', [Validators.required]),
      dpsId: this._fb.control({ value: '', disabled: true }, []),
      note: this._fb.control('', []),
    });
    if (this.isTransfer) {
      this.addTransactionForm.controls.paymentType.removeValidators([
        Validators.required,
      ]);
    } else {
      this.addTransactionForm.controls.benificiaryAccountNumber.removeValidators(
        [Validators.required]
      );
    }
    this.addTransactionForm.updateValueAndValidity();
  }

  accountList = computed(() => {
    return this._accountListResponse.hasValue() &&
      (this._accountListResponse.value().data || []).length > 0
      ? this._accountListResponse.value().data
      : [];
  });

  paymentAccountList = computed(() => {
    return (this.accountList() || []).filter((x) => x.canUpdate);
  });

  personalAccountList = computed(() => {
    return this.accountList()?.filter(
      (x) => x.accountType == accountType[0].value
    );
  });

  beneficiaryAccountList = computed(() => {
    return this.accountList()?.filter(
      (x) => x.accountType == accountType[1].value
    );
  });

  addTransaction() {
    if (this.addTransactionForm.invalid) return;
    this.isTransfer ? this.transferMoney() : this.makePayment();
  }

  private transferMoney() {
    const succesMessage = this._translateService.instant(
      ErrorMessageConst.SUCCESSFULLY_TRANSFERED_MONEY
    );
    const failedMessage = this._translateService.instant(
      ErrorMessageConst.SOMETHING_WENT_WRONG
    );
    const payload = this.getPayloadOfTransferMoney();
    this.isSubmitting.set(true);
    return this._transactionService
      .transferMoney(payload)
      .pipe(
        map((res) => res?.success),
        catchError((err) => of(false)),
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe((res) => {
        if (res) {
          this._toastMessageService.showSuccess(succesMessage);
        } else {
          this._toastMessageService.showFailed(failedMessage);
        }
        this.close(res);
      });
  }

  private makePayment() {
    const succesMessage = this._translateService.instant(
      ErrorMessageConst.PAYMENT_SUCCESSFULLY_DONE
    );
    const failedMessage = this._translateService.instant(
      ErrorMessageConst.SOMETHING_WENT_WRONG
    );
    const payload = this.getPayloadOfMakePayment();
    this.isSubmitting.set(true);
    return this._transactionService
      .makePayment(payload)
      .pipe(
        map((res) => res?.success),
        catchError((err) => of(false)),
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe((res) => {
        if (res) {
          this._toastMessageService.showSuccess(succesMessage);
        } else {
          this._toastMessageService.showFailed(failedMessage);
        }
        this.close(res);
      });
  }

  private getPayloadOfTransferMoney(): ITransferMoneyPayload {
    const formValue = this.addTransactionForm.getRawValue();
    return {
      sourceAc: formValue.accountNo,
      beneficiaryAc: formValue.benificiaryAccountNumber,
      amount: Number(formValue.amount),
      transactionNumber: formValue.transactionNumber,
      transactionDate: formValue.date
        ? normalizeDateToUTC(formValue.date).toISOString()
        : null,
      note: formValue.note,
    } as ITransferMoneyPayload;
  }

  private getPayloadOfMakePayment(): IMakePaymentPayload {
    const formValue = this.addTransactionForm.getRawValue();
    return {
      sourceAc: formValue.accountNo,
      paymentType: formValue.paymentType,
      dpsId: formValue.dpsId,
      amount: Number(formValue.amount),
      transactionNumber: formValue.transactionNumber,
      paymentDate: formValue.date
        ? normalizeDateToUTC(formValue.date).toISOString()
        : null,
      note: formValue.note,
    } as IMakePaymentPayload;
  }

  close(success: boolean = false) {
    if (this._dialogRef) this._dialogRef.close(success);
    else if (this._bottomSheetRef) this._bottomSheetRef.dismiss(success);
  }

  get isPlatformMobile() {
    return this._platformDetectorService.isPlaformMobile;
  }

  get isTransfer() {
    return (
      (this._dialogData && this._dialogData.isTransfer) ||
      (this._bottomSheetData && this._bottomSheetData.isTransfer)
    );
  }

  get paymentTypeFormValue() {
    return this.addTransactionForm.controls.paymentType.value;
  }

  changePaymentType() {
    setTimeout(() => {
      if (this.paymentTypeFormValue == 'dps') {
        this.addTransactionForm.controls.dpsId.addValidators([
          Validators.required,
        ]);
      } else {
        this.addTransactionForm.controls.dpsId.clearValidators();
      }
      this.addTransactionForm.updateValueAndValidity();
    });
  }

  selectAccount(event: MatSelectChange<any>) {
    if (!event.value) return;
    this.dpsListByAccountNo = (this.dpsList() || []).filter(
      (x) => x.accountNo == event.value
    );
    this.addTransactionForm.controls.dpsId.enable();
  }

  get availableBalanceOfSelectedAccount() {
    const accountNo = this.addTransactionForm.controls.accountNo.value;
    if (!accountNo) return 'N/A';
    else {
      return (
        this.accountList()?.find((x) => x.accountNo == accountNo)?.balance ??
        'N/A'
      );
    }
  }
}

interface AddTransactionForm {
  accountNo: FormControl<string | null>;
  transactionNumber: FormControl<string | null>;
  amount: FormControl<number | null>;
  benificiaryAccountNumber: FormControl<string | null>;
  date: FormControl<Date | null>;
  paymentType: FormControl<string | null>;
  dpsId: FormControl<string | null>;
  note: FormControl<string | null>;
}
