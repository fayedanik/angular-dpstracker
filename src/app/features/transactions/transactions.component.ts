import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AddTransactionComponent } from './components/add-transaction/add-transaction.component';
@Component({
  selector: 'app-transactions',
  imports: [MatButtonModule, MatIconModule, NgxDatatableModule, CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  private readonly _dialog = inject(MatDialog);

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

  get isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  openCreateTransactionDialog() {
    this._dialog.open(AddTransactionComponent, {
      width: '400px',
      maxWidth: '400px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '200ms',
    });
  }
}
