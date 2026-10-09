import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { PaymentTransaction } from '../../../domain/model/payment-transaction.entity';


@Component({
  selector: 'app-transaction-list',
  imports: [CurrencyPipe, DatePipe, ],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionList {
  /** Cobros a mostrar. */
  readonly transactions = input.required<PaymentTransaction[]>();

  /** Se emite al presionar "Ver todo el historial". */
  readonly viewHistory = output<void>();

  onViewHistory(): void {
    this.viewHistory.emit();
  }
}