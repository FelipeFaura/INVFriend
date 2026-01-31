/**
 * Wish Entity
 * Represents a gift wish in a Secret Santa group
 */

export interface WishProps {
  id: string;
  groupId: string;
  userId: string;
  title: string;
  description?: string;
  url?: string;
  estimatedPrice?: number;
  priority?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWishProps {
  id: string;
  groupId: string;
  userId: string;
  title: string;
  description?: string;
  url?: string;
  estimatedPrice?: number;
  priority?: number;
}

export interface UpdateWishProps {
  title?: string;
  description?: string;
  url?: string;
  estimatedPrice?: number;
  priority?: number;
}

export class Wish {
  private constructor(private readonly props: WishProps) {
    this.validate();
  }

  /**
   * Create a new Wish
   */
  static create(props: CreateWishProps): Wish {
    const now = new Date();
    return new Wish({
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstitute a Wish from persistence
   */
  static fromPersistence(props: WishProps): Wish {
    return new Wish(props);
  }

  private validate(): void {
    if (!this.props.id || this.props.id.trim() === "") {
      throw new Error("Wish ID is required");
    }
    if (!this.props.groupId || this.props.groupId.trim() === "") {
      throw new Error("Group ID is required");
    }
    if (!this.props.userId || this.props.userId.trim() === "") {
      throw new Error("User ID is required");
    }
    if (!this.props.title || this.props.title.trim() === "") {
      throw new Error("Title is required");
    }
    if (this.props.title.length > 200) {
      throw new Error("Title must be 200 characters or less");
    }
    if (this.props.description && this.props.description.length > 1000) {
      throw new Error("Description must be 1000 characters or less");
    }
    if (this.props.url && this.props.url.length > 500) {
      throw new Error("URL must be 500 characters or less");
    }
    if (
      this.props.estimatedPrice !== undefined &&
      this.props.estimatedPrice < 0
    ) {
      throw new Error("Estimated price cannot be negative");
    }
    if (
      this.props.priority !== undefined &&
      (this.props.priority < 1 || this.props.priority > 5)
    ) {
      throw new Error("Priority must be between 1 and 5");
    }
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get groupId(): string {
    return this.props.groupId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get url(): string | undefined {
    return this.props.url;
  }

  get estimatedPrice(): number | undefined {
    return this.props.estimatedPrice;
  }

  get priority(): number | undefined {
    return this.props.priority;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Update wish properties
   */
  update(props: UpdateWishProps): Wish {
    return new Wish({
      ...this.props,
      title: props.title ?? this.props.title,
      description: props.description ?? this.props.description,
      url: props.url ?? this.props.url,
      estimatedPrice: props.estimatedPrice ?? this.props.estimatedPrice,
      priority: props.priority ?? this.props.priority,
      updatedAt: new Date(),
    });
  }

  /**
   * Check if wish belongs to user
   */
  belongsToUser(userId: string): boolean {
    return this.props.userId === userId;
  }

  /**
   * Check if wish belongs to group
   */
  belongsToGroup(groupId: string): boolean {
    return this.props.groupId === groupId;
  }

  /**
   * Convert to plain object for persistence
   */
  toObject(): WishProps {
    return { ...this.props };
  }
}
