import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { BankService } from '../../../../core/services/bank.service';
import { IBankListResponse } from '../../../../shared/interfaces/bank-list-response.interface';
import { PlatformDetectorService } from '../../../../shared/services/platform-detector.service';
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
  ],
  templateUrl: './add-bank-account.component.html',
  styleUrl: './add-bank-account.component.scss',
})
export class AddBankAccountComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _bankList = inject(BankService).getBankList();
  private readonly _selectedBank = signal<IBankListResponse | null>(null);
  private readonly _platformDetectorService = inject(PlatformDetectorService);

  accountType = [
    {
      label: 'Personal',
      Value: 'Personal',
    },
    {
      label: 'Joint',
      Value: 'Joint',
    },
  ];

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

  addBankAccountForm = this._fb.nonNullable.group({
    accountNumber: new FormControl('', {
      validators: [Validators.required],
    }),
    bankName: new FormControl('', {
      validators: [Validators.required],
    }),
    branchName: new FormControl(
      { value: '', disabled: true },
      {
        validators: [Validators.required],
      }
    ),
    accountType: ['', Validators.required],
  });

  addTransaction() {}

  selectBank(event: MatSelectChange<IBankListResponse>) {
    this._selectedBank.set(event.value);
    this.addBankAccountForm.controls.branchName.enable();
  }

  get isPlatformMobile() {
    return this._platformDetectorService.isPlaformMobile;
  }
}
