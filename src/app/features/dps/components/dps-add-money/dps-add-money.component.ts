import { CommonModule } from '@angular/common';
import { Component, Inject, inject, Optional, signal } from '@angular/core';
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
import { DpsService } from '../../../../core/services/dps.service';
import { ErrorMessageConst } from '../../../../shared/consts/errorMessage.const';
import { IAddDpsMoneyPayload } from '../../../../shared/interfaces/add-dps-money-payload.interface';
import { IDps, IDpsOwner } from '../../../../shared/interfaces/dps.interface';
import { PlatformDetectorService } from '../../../../shared/services/platform-detector.service';
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
import { months } from '../../../../shared/utils/date-utils';

@Component({
  selector: 'app-dps-add-money',
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
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './dps-add-money.component.html',
  styleUrl: './dps-add-money.component.scss',
})
export class DpsAddMoneyComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _platformDetectorService = inject(PlatformDetectorService);
  private readonly _dpsService = inject(DpsService);
  private readonly _toastMessageService = inject(ToastMessageService);
  private readonly _translateService = inject(TranslateService);

  readonly months = months;
  todayDate = new Date();
  minDate!: Date;
  maxDate!: Date;
  years: number[] = [];
  monthIdx: number[] = [];
  dpsInstallmentDates: Date[] = [];

  data!: { dps: IDps; owner: IDpsOwner };

  isLoading = signal(false);

  constructor(
    @Optional()
    private readonly _dialogRef: MatDialogRef<DpsAddMoneyComponent>,
    @Optional()
    private readonly _bottomSheetRef: MatBottomSheetRef<DpsAddMoneyComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    private readonly _dialogData: { dps: IDps; owner: IDpsOwner },
    @Optional()
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private readonly _bottomSheetData: { dps: IDps; owner: IDpsOwner }
  ) {
    this.data = this._dialogData ?? this._bottomSheetData;
    this.dpsAddMoneyForm.controls.name.setValue(this.data.owner.displayName);
    this.dpsAddMoneyForm.controls.amount.setValue(
      (this.data.dps.dpsOwners || []).length > 0
        ? Math.ceil(
            this.data.dps.monthlyAmount / this.data.dps.dpsOwners.length
          )
        : this.data.dps.monthlyAmount
    );
    this.minDate = new Date(this.data.dps.startDate);
    this.maxDate = new Date(this.data.dps.maturityDate);
    for (
      let year = this.minDate.getFullYear();
      year <= this.maxDate.getFullYear();
      year++
    ) {
      for (let month = 0; month < 12; month++) {
        const currDate = new Date(year, month, 1);
        if (this.minDate <= currDate && currDate < this.maxDate) {
          this.dpsInstallmentDates.push(currDate);
        }
      }
      this.years.push(year);
    }
  }

  dpsAddMoneyForm: FormGroup<DpsAddMoneyForm> = this._fb.group<DpsAddMoneyForm>(
    {
      amount: this._fb.control({ value: 0, disabled: true }, []),
      name: this._fb.control({ value: '', disabled: true }, []),
      selectYear: this._fb.control(null, [Validators.required]),
      selectMonth: this._fb.control({ value: null, disabled: true }, [
        Validators.required,
      ]),
    }
  );

  get isPlatformMobile() {
    return this._platformDetectorService.isPlaformMobile;
  }

  close(isReload: boolean = false) {
    if (this._dialogRef) this._dialogRef.close(isReload);
    else if (this._bottomSheetData) this._bottomSheetRef.dismiss(isReload);
  }

  addDpsMoney() {
    const errorMessage = this._translateService.instant(
      ErrorMessageConst.SOMETHING_WENT_WRONG
    );
    const successMessage = this._translateService.instant(
      ErrorMessageConst.DPS_PAYEMENT_SUCCESSFULLY_DONE
    );
    const dps = this._dialogData?.dps ?? this._bottomSheetData?.dps;
    const owner = this._dialogData?.owner ?? this._bottomSheetData?.owner;
    const formValue = this.dpsAddMoneyForm.getRawValue();
    this.isLoading.set(true);
    const payload: IAddDpsMoneyPayload = {
      dpsId: dps.id,
      ownerId: owner.userId,
      paymentDate: new Date(
        Number(formValue.selectYear),
        Number(formValue.selectMonth),
        1
      ),
    };
    this._dpsService
      .updateDps(payload)
      .pipe(
        map((res) => res.success),
        catchError((err) => of(false)),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((res) => {
        if (res) {
          this._toastMessageService.showSuccess(successMessage);
          this.close(true);
        } else {
          this._toastMessageService.showFailed(errorMessage);
        }
      });
  }

  changeYear(event: MatSelectChange) {
    const year = event.value;
    this.monthIdx = this.dpsInstallmentDates
      .filter((x) => x.getFullYear() == year)
      .map((x) => x.getMonth());
    this.monthIdx.forEach((x) => {
      console.log(this.isPaidAlready(year, x));
    });
    this.dpsAddMoneyForm.controls.selectMonth.enable();
  }

  isPaidAlready(year: number, month: number) {
    return (
      (this.data.owner?.installmentDates ?? [])
        .map((x) => new Date(x))
        .filter((x) => x.getMonth() == month && x.getFullYear() == year)
        .length > 0
    );
  }

  isAhedOfFuture(year: number, month: number) {
    return new Date(year, month, 1) > new Date();
  }
}

interface DpsAddMoneyForm {
  amount: FormControl<number | null>;
  name: FormControl<string | null>;
  selectYear: FormControl<number | null>;
  selectMonth: FormControl<number | null>;
}
