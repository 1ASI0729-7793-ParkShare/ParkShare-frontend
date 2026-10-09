import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { RatingScore } from './reputation-types';

export class Rating implements BaseEntity {
  #id: number;
  #bookingId: number;
  #reviewerId: number;
  #revieweeId: number;
  #score: RatingScore;
  #comment: string | null;
  #createdAt: string;

  constructor(props: {
    id: number;
    bookingId: number;
    reviewerId: number;
    revieweeId: number;
    score: number;
    comment: string | null;
    createdAt: string;
  }) {
    this.#id = props.id;
    this.#bookingId = props.bookingId;
    this.#reviewerId = props.reviewerId;
    this.#revieweeId = props.revieweeId;
    this.#score = Rating.validateScore(props.score);
    this.#comment = props.comment;
    this.#createdAt = props.createdAt;
  }

  private static validateScore(value: number): RatingScore {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error('Rating score must be an integer between 1 and 5.');
    }

    return value as RatingScore;
  }

  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  get bookingId(): number {
    return this.#bookingId;
  }

  get reviewerId(): number {
    return this.#reviewerId;
  }

  get revieweeId(): number {
    return this.#revieweeId;
  }

  get score(): RatingScore {
    return this.#score;
  }

  set score(value: RatingScore) {
    this.#score = Rating.validateScore(value);
  }

  get comment(): string | null {
    return this.#comment;
  }

  set comment(value: string | null) {
    this.#comment = value;
  }

  get createdAt(): string {
    return this.#createdAt;
  }
}
