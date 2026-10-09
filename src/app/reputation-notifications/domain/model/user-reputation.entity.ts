import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Rating } from './rating.entity';

export class UserReputation implements BaseEntity {
  #id: number;
  #userId: number;
  #averageRating: number;
  #totalRatings: number;

  constructor(props: { id: number; userId: number; averageRating: number; totalRatings: number }) {
    this.#id = props.id;
    this.#userId = props.userId;
    this.#averageRating = UserReputation.validateAverage(props.averageRating);
    this.#totalRatings = UserReputation.validateTotal(props.totalRatings);
  }

  private static validateAverage(value: number): number {
    if (!Number.isFinite(value) || value < 0 || value > 5) {
      throw new Error('Average rating must be a number between 0 and 5.');
    }

    return value;
  }

  private static validateTotal(value: number): number {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Total ratings must be a non-negative integer.');
    }

    return value;
  }

  static fromRatings(id: number, userId: number, ratings: Rating[]): UserReputation {
    const receivedRatings = ratings.filter((rating) => rating.revieweeId === userId);

    const totalRatings = receivedRatings.length;

    const averageRating =
      totalRatings === 0
        ? 0
        : receivedRatings.reduce((sum, rating) => sum + rating.score, 0) / totalRatings;

    return new UserReputation({
      id,
      userId,
      averageRating,
      totalRatings,
    });
  }

  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  get userId(): number {
    return this.#userId;
  }

  get averageRating(): number {
    return this.#averageRating;
  }

  get totalRatings(): number {
    return this.#totalRatings;
  }
}
