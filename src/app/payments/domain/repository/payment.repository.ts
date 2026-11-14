import { Observable } from 'rxjs';
import { OwnerPayout } from '../model/owner-payout.entity';
import { PaymentTransaction } from '../model/payment-transaction.entity';


export abstract class PaymentRepository {
  /** Obtiene el resumen de saldo del propietario (US23). */
  abstract getOwnerPayout(ownerId: number): Observable<OwnerPayout>;

  /** Obtiene el detalle de cobros recientes del propietario (US23). */
  abstract getOwnerTransactions(ownerId: number): Observable<PaymentTransaction[]>;

  /** Solicita transferir el saldo disponible a la cuenta bancaria vinculada. */
  abstract requestPayoutTransfer(ownerId: number): Observable<OwnerPayout>;
}