import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { DocumentStatus, DocumentType } from './profile-types';

export class VerificationDocument implements BaseEntity {
  #id: number;
  #profileId: number;
  #type: DocumentType;
  #status: DocumentStatus;
  #updatedAt: string;
  #fileName: string | null;

  constructor(props: {
    id: number;
    profileId: number;
    type: DocumentType;
    status: DocumentStatus;
    updatedAt: string;
    fileName: string | null;
  }) {
    this.#id = props.id;
    this.#profileId = props.profileId;
    this.#type = props.type;
    this.#status = props.status;
    this.#updatedAt = props.updatedAt;
    this.#fileName = props.fileName;
  }

  get id(): number {
    return this.#id;
  }
  set id(value: number) {
    this.#id = value;
  }

  get profileId(): number {
    return this.#profileId;
  }
  set profileId(value: number) {
    this.#profileId = value;
  }

  get type(): DocumentType {
    return this.#type;
  }
  set type(value: DocumentType) {
    this.#type = value;
  }

  get status(): DocumentStatus {
    return this.#status;
  }
  set status(value: DocumentStatus) {
    this.#status = value;
  }

  get updatedAt(): string {
    return this.#updatedAt;
  }
  set updatedAt(value: string) {
    this.#updatedAt = value;
  }

  get fileName(): string | null {
    return this.#fileName;
  }
  set fileName(value: string | null) {
    this.#fileName = value;
  }
}
