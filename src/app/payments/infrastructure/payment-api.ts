import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OwnerPayout } from '../domain/model/owner-payout.entity';
import { PaymentTransaction } from '../domain/model/payment-transaction.entity';
import { PaymentRepository } from '../domain/repository/payment.repository';
import { PaymentAssembler } from './payment-assembler';
import { OwnerPayoutResponse, PaymentTransactionResponse } from './payment-response';

/**
 * Implementación del contrato PaymentRepository.
 * Consume la API falsa (json-server con db.json) y usa el assembler
 * para devolver entidades del dominio, nunca datos crudos.
 */
@Injectable()
export class PaymentApi extends PaymentRepository {
  private readonly http = inject(HttpClient);
  private readonly assembler = inject(PaymentAssembler);

  private readonly payoutsUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderOwnerPayoutsEndpointPath}`;
  private readonly transactionsUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderPaymentTransactionsEndpointPath}`;

  getOwnerPayout(ownerId: number): Observable<OwnerPayout> {
    return this.http
      .get<OwnerPayoutResponse[]>(this.payoutsUrl, { params: { ownerId: String(ownerId) } })
      .pipe(
        map((responses) => {
          if (responses.length === 0) {
            throw new Error(`No existe resumen de pagos para el propietario ${ownerId}`);
          }
          return this.assembler.toOwnerPayoutFromResponse(responses[0]);
        }),
      );
  }

  getOwnerTransactions(ownerId: number): Observable<PaymentTransaction[]> {
    return this.http
      .get<PaymentTransactionResponse[]>(this.transactionsUrl, { params: { ownerId: String(ownerId) } })
      .pipe(map((responses) => this.assembler.toTransactionsFromResponses(responses)));
  }

  /** El backend mueve el saldo disponible a "En tránsito" y devuelve el resumen actualizado. */
  requestPayoutTransfer(ownerId: number): Observable<OwnerPayout> {
    return this.http
      .get<OwnerPayoutResponse[]>(this.payoutsUrl, { params: { ownerId: String(ownerId) } })
      .pipe(
        map((responses) => responses[0]),
        switchMap((current) =>
          this.http.post<OwnerPayoutResponse>(`${this.payoutsUrl}/${current.id}/transfer`, {}),
        ),
        map((updated) => this.assembler.toOwnerPayoutFromResponse(updated)),
      );
  }
}