import { BaseEntity } from '../../../shared/domain/model/base-entity';

export interface OwnerListingProps {
  id: number;
  ownerId: number;
  name: string;
  rating: number;
}

export class OwnerListing implements BaseEntity {
  readonly #props: OwnerListingProps;

  constructor(props: OwnerListingProps) {
    this.#props = { ...props };
  }

  get id(): number {
    return this.#props.id;
  }
  get ownerId(): number {
    return this.#props.ownerId;
  }
  get name(): string {
    return this.#props.name;
  }
  get rating(): number {
    return this.#props.rating;
  }
}
