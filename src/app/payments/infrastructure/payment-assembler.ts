import { Injectable } from '@angular/core';
import { OwnerPayout } from '../domain/model/owner-payout.entity';
import { PaymentTransaction } from '../domain/model/payment-transaction.entity';
import { OwnerPayoutResponse, PaymentTransactionResponse } from './payment-response';

/**
 * Convierte los datos de la API (responses) en entidades del dominio.
 * Aquí se transforman los tipos, por ejemplo el texto ISO de la fecha en Date.
 */
@Injectable()
export class PaymentAssembler {
  toOwnerPayoutFromResponse(response: OwnerPayoutResponse): OwnerPayout {
    return new OwnerPayout({
      ownerId: response.ownerId,
      availableBalance: response.availableBalance,
      completedAmount: response.completedAmount,
      inTransitAmount: response.inTransitAmount,
      linkedAccount: response.linkedAccount,
      commissionRate: response.commissionRate,
    });
  }

  toTransactionFromResponse(response: PaymentTransactionResponse): PaymentTransaction {
    return new PaymentTransaction({
      id: String(response.id),
      reservationId: response.reservationId,
      driverName: response.driverName,
      garageName: response.garageName,
      date: new Date(response.date),
      durationMinutes: response.durationMinutes,
      amountReceived: response.amountReceived,
    });
  }

  toTransactionsFromResponses(responses: PaymentTransactionResponse[]): PaymentTransaction[] {
    return responses.map((response) => this.toTransactionFromResponse(response));
  }
}