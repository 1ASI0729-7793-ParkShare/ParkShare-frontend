import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { NotificationRelatedEntityType, NotificationType } from './reputation-types';

export class Notification implements BaseEntity {
  #id: number;
  #recipientId: number;
  #type: NotificationType;
  #title: string;
  #message: string;
  #createdAt: string;
  #readAt: string | null;
  #relatedEntityType: NotificationRelatedEntityType | null;
  #relatedEntityId: number | null;

  constructor(props: {
    id: number;
    recipientId: number;
    type: NotificationType;
    title: string;
    message: string;
    createdAt: string;
    readAt: string | null;
    relatedEntityType: NotificationRelatedEntityType | null;
    relatedEntityId: number | null;
  }) {
    this.#id = props.id;
    this.#recipientId = props.recipientId;
    this.#type = props.type;
    this.#title = props.title;
    this.#message = props.message;
    this.#createdAt = props.createdAt;
    this.#readAt = props.readAt;
    this.#relatedEntityType = props.relatedEntityType;
    this.#relatedEntityId = props.relatedEntityId;
  }

  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  get recipientId(): number {
    return this.#recipientId;
  }

  get type(): NotificationType {
    return this.#type;
  }

  get title(): string {
    return this.#title;
  }

  get message(): string {
    return this.#message;
  }

  get createdAt(): string {
    return this.#createdAt;
  }

  get readAt(): string | null {
    return this.#readAt;
  }

  get isRead(): boolean {
    return this.#readAt !== null;
  }

  get relatedEntityType(): NotificationRelatedEntityType | null {
    return this.#relatedEntityType;
  }

  get relatedEntityId(): number | null {
    return this.#relatedEntityId;
  }

  markAsRead(at: string = new Date().toISOString()): void {
    if (this.#readAt === null) {
      this.#readAt = at;
    }
  }
}
