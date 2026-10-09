
export class PaymentTransaction {
  private _id: string;
  private _reservationId: string;
  private _driverName: string;
  private _garageName: string;
  private _date: Date;
  private _durationMinutes: number;
  private _amountReceived: number;

  constructor(props: {
    id: string;
    reservationId: string;
    driverName: string;
    garageName: string;
    date: Date;
    durationMinutes: number;
    amountReceived: number;
  }) {
    this._id = props.id;
    this._reservationId = props.reservationId;
    this._driverName = props.driverName;
    this._garageName = props.garageName;
    this._date = props.date;
    this._durationMinutes = props.durationMinutes;
    this._amountReceived = props.amountReceived;
  }

  get id(): string {
    return this._id;
  }

  /** Referencia a la reserva (Booking). */
  get reservationId(): string {
    return this._reservationId;
  }

  /** Ej: "Daniela R." */
  get driverName(): string {
    return this._driverName;
  }

  /** Ej: "Cochera Miraflores" */
  get garageName(): string {
    return this._garageName;
  }

  get date(): Date {
    return this._date;
  }

  /** Duración del uso en minutos. Ej: 240 */
  get durationMinutes(): number {
    return this._durationMinutes;
  }

  /** Monto neto recibido por el propietario, ya sin comisión. Ej: 20.00 */
  get amountReceived(): number {
    return this._amountReceived;
  }

  /** Duración con el formato de la pantalla. Ej: 240 -> "4h 00m" */
  get formattedDuration(): string {
    const hours = Math.floor(this._durationMinutes / 60);
    const minutes = this._durationMinutes % 60;
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }
}