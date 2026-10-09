import { Observable } from 'rxjs';
import { OwnerPayout } from '../model/owner-payout.entity';
import { PaymentTransaction } from '../model/payment-transaction.entity';


export abstract class PaymentRepository {
  /** Obtiene el resumen de saldo del propietario (US23). */
  abstract getOwnerPayout(ownerId: string): Observable<OwnerPayout>;

  /** Obtiene el detalle de cobros recientes del propietario (US23). */
  abstract getOwnerTransactions(ownerId: string): Observable<PaymentTransaction[]>;

  /** Solicita transferir el saldo disponible a la cuenta bancaria vinculada. */
  abstract requestPayoutTransfer(ownerId: string): Observable<OwnerPayout>;
}