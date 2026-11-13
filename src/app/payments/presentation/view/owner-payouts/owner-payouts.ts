import { CURRENT_OWNER_ID } from '../../../../shared/domain/model/current-user';
import { Component, inject, OnInit } from '@angular/core';
import { PaymentsStore } from '../../../application/payments.store';
import { BalanceCard } from '../../components/balance-card/balance-card';
import { TransactionList } from '../../components/transaction-list/transaction-list';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-owner-payouts',
  imports: [BalanceCard, TransactionList,CommonModule, ],
  templateUrl: './owner-payouts.html',
  styleUrl: './owner-payouts.css',
})
export class OwnerPayouts implements OnInit {
  protected readonly store = inject(PaymentsStore);

  private readonly ownerId = CURRENT_OWNER_ID;

  ngOnInit(): void {
    this.store.loadOwnerIncome(this.ownerId);
  }

  onTransfer(): void {
    this.store.transferToBank(this.ownerId);
  }

  onRetry(): void {
    this.store.loadOwnerIncome(this.ownerId);
  }
}