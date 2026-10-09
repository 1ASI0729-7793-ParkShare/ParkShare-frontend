import { Routes } from '@angular/router';
import { PaymentsStore } from '../application/payments.store';
import { PaymentRepository } from '../domain/repository/payment.repository';
import { PaymentApi } from '../infrastructure/payment-api';
import { PaymentAssembler } from '../infrastructure/payment-assembler';
import { OwnerPayouts } from './view/owner-payouts/owner-payouts';

/**
 * Rutas del bounded context Payments.
 * Aquí se registran las dependencias del contexto: solo existen
 * dentro de estas rutas y no afectan a los demás contextos.
 */
export const paymentsRoutes: Routes = [
  {
    path: '',
    providers: [
      PaymentAssembler,
      PaymentApi,
      { provide: PaymentRepository, useExisting: PaymentApi },
      PaymentsStore,
    ],
    children: [
      { path: '', redirectTo: 'owner-payouts', pathMatch: 'full' },
      { path: 'owner-payouts', component: OwnerPayouts },
    ],
  },
];