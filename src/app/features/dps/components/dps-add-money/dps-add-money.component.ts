import { CommonModule } from '@angular/common';
import { Component, Inject, inject, Optional } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { catchError, map, of } from 'rxjs';
import { DpsService } from '../../../../core/services/dps.service';
import { ErrorMessageConst } from '../../../../shared/consts/errorMessage.const';
import { IAddDpsMoneyPayload } from '../../../../shared/interfaces/add-dps-money-payload.interface';
import { IDps, IDpsOwner } from '../../../../shared/interfaces/dps.interface';
import { PlatformDetectorService } from '../../../../shared/services/platform-detector.service';
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
import { normalizeDateToUTC } from '../../../../shared/utils/date-utils';

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
  todayDate = new Date();
  minDate!: Date;
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
    if (this._dialogData?.owner) {
      this.dpsAddMoneyForm.controls.name.setValue(
        this._dialogData.owner.displayName
      );
      this.dpsAddMoneyForm.controls.amount.setValue(
        this._dialogData.dps.monthlyAmount
      );
    } else if (this._bottomSheetData?.owner) {
      this.dpsAddMoneyForm.controls.name.setValue(
        this._bottomSheetData.owner.displayName
      );
      this.dpsAddMoneyForm.controls.amount.setValue(
        this._bottomSheetData.dps.monthlyAmount
      );
    }
    this.minDate = new Date(
      this._dialogData?.dps.startDate ?? this._bottomSheetData?.dps.startDate
    );
  }

  dpsAddMoneyForm: FormGroup<DpsAddMoneyForm> = this._fb.group<DpsAddMoneyForm>(
    {
      amount: this._fb.control({ value: null, disabled: true }, []),
      name: this._fb.control({ value: '', disabled: true }, []),
      paymentDate: this._fb.control(null, [Validators.required]),
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
    const succesMessage = this._translateService.instant(
      ErrorMessageConst.DPS_PAYEMENT_SUCCESSFULLY_DONE
    );
    const dps = this._dialogData?.dps ?? this._bottomSheetData?.dps;
    const owner = this._dialogData?.owner ?? this._bottomSheetData?.owner;
    const formValue = this.dpsAddMoneyForm.getRawValue();
    const payload: IAddDpsMoneyPayload = {
      dpsId: dps.id,
      ownerId: owner.userId,
      paymentDate: formValue.paymentDate
        ? normalizeDateToUTC(formValue.paymentDate)
        : null,
    };
    this._dpsService
      .updateDps(payload)
      .pipe(
        map((res) => res.success),
        catchError((err) => of(false))
      )
      .subscribe((res) => {
        if (res) {
          this._toastMessageService.showSuccess(succesMessage);
          this.close(true);
        } else {
          this._toastMessageService.showFailed(errorMessage);
        }
      });
  }
}

interface DpsAddMoneyForm {
  amount: FormControl<number | null>;
  name: FormControl<string | null>;
  paymentDate: FormControl<Date | null>;
}
