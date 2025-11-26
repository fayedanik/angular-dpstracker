import { CommonModule } from '@angular/common';
import { Component, computed, inject, Optional, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { DpsService } from '../../../../core/services/dps.service';
import { ErrorMessageConst } from '../../../../shared/consts/errorMessage.const';
import { DigitsOnlyDirective } from '../../../../shared/directives/digits-only.directive';
import { IAddDpsPayload } from '../../../../shared/interfaces/add-dps-payload.interface';
import { PlatformDetectorService } from '../../../../shared/services/platform-detector.service';
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
import { normalizeDateToUTC } from '../../../../shared/utils/date-utils';
@Component({
  selector: 'app-add-dps',
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
    MatDatepickerModule,
    DigitsOnlyDirective,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './add-dps.component.html',
  styleUrl: './add-dps.component.scss',
})
export class AddDpsComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _platformDetectorService = inject(PlatformDetectorService);
  private readonly _toastMessageService = inject(ToastMessageService);
  private readonly _translateService = inject(TranslateService);
  private readonly _dpsService = inject(DpsService);
  private readonly _bankAccountService = inject(BankAccountService);

  private readonly _accountListResponse =
    this._bankAccountService.getAccounts();

  accountList = computed(() => {
    return this._accountListResponse.hasValue() &&
      (this._accountListResponse.value().data || []).length > 0
      ? this._accountListResponse.value().data?.filter((x) => x.canUpdate)
      : [];
  });

  isSubmitting = signal(false);
  isLoading = computed(
    () => this.isSubmitting() || this._accountListResponse.isLoading()
  );

  addDpsForm: FormGroup<AddDpsForm> = this._fb.group<AddDpsForm>({
    dpsName: this._fb.control('', {
      validators: [Validators.required],
    }),
    accountNumber: this._fb.control('', {
      validators: [Validators.required],
    }),
    monthlyDeposit: this._fb.control(null, {
      validators: [Validators.required],
    }),
    durationMonths: this._fb.control(null, {
      validators: [Validators.required],
    }),
    startDate: this._fb.control(
      { value: null, disabled: true },
      { validators: [Validators.required] }
    ),
    maturityDate: this._fb.control(
      { value: null, disabled: true },
      {
        validators: [Validators.required],
      }
    ),
    interestRate: this._fb.control(null, {
      validators: [Validators.required],
    }),
    dpsOwners: this._fb.control(null, { validators: [Validators.required] }),
  });

  $accountNo = this.addDpsForm.controls.accountNumber.valueChanges;
  selectedAccountNo = toSignal(this.$accountNo);

  selectedAccountOwners = computed(() => {
    if (!this.selectedAccountNo()) return [];
    const bankAccount = this.accountList()?.find(
      (x) => x.accountNo == this.selectedAccountNo()
    );
    return bankAccount?.accountHolders;
  });

  constructor(
    @Optional()
    private readonly _dialogRef: MatDialogRef<AddDpsComponent>,
    @Optional()
    private readonly _bottomSheetRef: MatBottomSheetRef<AddDpsComponent>
  ) {}

  addDps() {
    if (this.addDpsForm.invalid) return;
    const succesMessage = this._translateService.instant(
      ErrorMessageConst.DPS_ADDED
    );
    const failedMessage = this._translateService.instant(
      ErrorMessageConst.SOMETHING_WENT_WRONG
    );
    const payload = this.getPayloadForAddDps();
    this.isSubmitting.set(true);
    this._dpsService
      .addDps(payload)
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

  get isPlatformMobile() {
    return this._platformDetectorService.isPlaformMobile;
  }

  close(success: boolean = false) {
    if (this._dialogRef) this._dialogRef.close(success);
    else if (this._bottomSheetRef) this._bottomSheetRef.dismiss(success);
  }

  durationMonthChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value) {
      this.addDpsForm.controls.startDate.enable();
      this.addDpsForm.controls.startDate.reset();
      this.addDpsForm.controls.maturityDate.reset();
    } else {
      this.addDpsForm.controls.startDate.disable();
    }
  }

  startDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    if (!event.value) return;
    const durationMonth = this.addDpsForm.controls.durationMonths.value;
    if (durationMonth) {
      let maturityDate = new Date(event.value);
      maturityDate.setMonth(maturityDate.getMonth() + Number(durationMonth));
      console.log(maturityDate);
      this.addDpsForm.controls.maturityDate.setValue(new Date(maturityDate));
    }
  }

  private getPayloadForAddDps(): IAddDpsPayload {
    const formValue = this.addDpsForm.getRawValue();
    return {
      dpsName: formValue.dpsName,
      accountNumber: formValue.accountNumber,
      monthlyDeposit: Number(formValue.monthlyDeposit),
      durationMonths: Number(formValue.durationMonths),
      startDate: formValue.startDate
        ? normalizeDateToUTC(formValue.startDate).toISOString()
        : null,
      maturityDate: formValue.maturityDate?.toISOString(),
      interestRate: Number(formValue.interestRate),
      dpsOwners: formValue.dpsOwners,
    } as IAddDpsPayload;
  }
}

interface AddDpsForm {
  dpsName: FormControl<string | null>;
  accountNumber: FormControl<string | null>;
  monthlyDeposit: FormControl<number | null>;
  durationMonths: FormControl<number | null>;
  startDate: FormControl<Date | null>;
  maturityDate: FormControl<Date | null>;
  interestRate: FormControl<number | null>;
  dpsOwners: FormControl<string[] | null>;
}
