import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { OwnerPayout } from '../../../domain/model/owner-payout.entity';

@Component({
  selector: 'app-balance-card',
  imports: [CurrencyPipe],
  templateUrl: './balance-card.html',
  styleUrl: './balance-card.css',
})
export class BalanceCard {
  /** Resumen económico del propietario. */
  readonly payout = input.required<OwnerPayout>();

  /** Habilita o deshabilita el botón (lo decide el store). */
  readonly canTransfer = input<boolean>(false);

  /** Indica que hay una transferencia en curso. */
  readonly transferring = input<boolean>(false);

  /** Se emite al presionar "Transferir a mi banco". */
  readonly transfer = output<void>();

  onTransfer(): void {
    this.transfer.emit();
  }
}