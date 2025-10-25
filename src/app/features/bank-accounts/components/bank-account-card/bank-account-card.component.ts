import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { IBankAccount } from '../../../../shared/interfaces/bank-account.interface';

@Component({
  selector: 'app-bank-account-card',
  imports: [
    MatTooltipModule,
    TranslatePipe,
    MatIconModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './bank-account-card.component.html',
  styleUrl: './bank-account-card.component.scss',
})
export class BankAccountCardComponent {
  bankAccount = input.required<IBankAccount>();
  openDrawer = output<void>();
  deleteAccount = output<void>();
  updateAccount = output<void>();
}
