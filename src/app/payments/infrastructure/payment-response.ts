/**
 * Forma EXACTA de los datos que devuelve la API de pagos.
 * Son solo tipos: no tienen lógica. El assembler los convierte en entidades del dominio.
 */

/** Respuesta del resumen de saldo del propietario. */
export interface OwnerPayoutResponse {
  id: number;
  ownerId: string;
  availableBalance: number;
  completedAmount: number;
  inTransitAmount: number;
  linkedAccount: string;
  commissionRate: number;
}

/** Respuesta de un cobro individual. La fecha llega como texto ISO. */
export interface PaymentTransactionResponse {
  id: number | string;
  reservationId: string;
  driverName: string;
  garageName: string;
  date: string;
  durationMinutes: number;
  amountReceived: number;
}