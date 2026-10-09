import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { OwnerPayout } from '../domain/model/owner-payout.entity';
import { PaymentTransaction } from '../domain/model/payment-transaction.entity';
import { PaymentRepository } from '../domain/repository/payment.repository';

@Injectable()
export class PaymentsStore {
  private readonly repository = inject(PaymentRepository);

  // Estado interno (solo el store puede modificarlo)
  private readonly payoutSignal = signal<OwnerPayout | null>(null);
  private readonly transactionsSignal = signal<PaymentTransaction[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly transferringSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  // Estado expuesto a la vista (solo lectura)
  readonly payout = this.payoutSignal.asReadonly();
  readonly transactions = this.transactionsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly transferring = this.transferringSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /** Cantidad de cobros cargados (para "Mostrando N transacciones recientes"). */
  readonly transactionCount = computed(() => this.transactionsSignal().length);

  /** El botón "Transferir a mi banco" solo se habilita con saldo y sin transferencia en curso. */
  readonly canTransfer = computed(() => {
    const payout = this.payoutSignal();
    return !!payout && payout.availableBalance > 0 && !this.transferringSignal();
  });

  /** Carga el saldo y el detalle de cobros del propietario. */
  loadOwnerIncome(ownerId: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    forkJoin({
      payout: this.repository.getOwnerPayout(ownerId),
      transactions: this.repository.getOwnerTransactions(ownerId),
    }).subscribe({
      next: ({ payout, transactions }) => {
        this.payoutSignal.set(payout);
        this.transactionsSignal.set(transactions);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('No se pudieron cargar tus ingresos. Intenta nuevamente.');
        this.loadingSignal.set(false);
      },
    });
  }

  /** Solicita transferir el saldo disponible a la cuenta bancaria vinculada. */
  transferToBank(ownerId: string): void {
    if (!this.canTransfer()) return;

    this.transferringSignal.set(true);
    this.errorSignal.set(null);

    this.repository.requestPayoutTransfer(ownerId).subscribe({
      next: (updatedPayout) => {
        this.payoutSignal.set(updatedPayout);
        this.transferringSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('No se pudo realizar la transferencia. Intenta nuevamente.');
        this.transferringSignal.set(false);
      },
    });
  }
}