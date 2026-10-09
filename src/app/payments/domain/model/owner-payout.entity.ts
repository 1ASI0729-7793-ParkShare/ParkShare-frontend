export class OwnerPayout {
  private _ownerId: string;
  private _availableBalance: number;
  private _completedAmount: number;
  private _inTransitAmount: number;
  private _linkedAccount: string;
  private _commissionRate: number;

  constructor(props: {
    ownerId: string;
    availableBalance: number;
    completedAmount: number;
    inTransitAmount: number;
    linkedAccount: string;
    commissionRate: number;
  }) {
    this._ownerId = props.ownerId;
    this._availableBalance = props.availableBalance;
    this._completedAmount = props.completedAmount;
    this._inTransitAmount = props.inTransitAmount;
    this._linkedAccount = props.linkedAccount;
    this._commissionRate = props.commissionRate;
  }

  /** Id del propietario (referencia a otro contexto). */
  get ownerId(): string {
    return this._ownerId;
  }

  /** Saldo que el propietario puede transferir a su banco. Ej: 840.00 */
  get availableBalance(): number {
    return this._availableBalance;
  }

  /** Total de transferencias ya completadas. Ej: 2400.00 */
  get completedAmount(): number {
    return this._completedAmount;
  }

  /** Monto transferido que aún no llega a la cuenta. Ej: 120.00 */
  get inTransitAmount(): number {
    return this._inTransitAmount;
  }

  /** Cuenta bancaria vinculada, ya enmascarada. Ej: "BCP ******452" */
  get linkedAccount(): string {
    return this._linkedAccount;
  }

  /** Comisión por servicio como porcentaje. Ej: 10 */
  get commissionRate(): number {
    return this._commissionRate;
  }
}