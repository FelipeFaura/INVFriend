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
export declare class Wish {
    private readonly props;
    private constructor();
    /**
     * Create a new Wish
     */
    static create(props: CreateWishProps): Wish;
    /**
     * Reconstitute a Wish from persistence
     */
    static fromPersistence(props: WishProps): Wish;
    private validate;
    get id(): string;
    get groupId(): string;
    get userId(): string;
    get title(): string;
    get description(): string | undefined;
    get url(): string | undefined;
    get estimatedPrice(): number | undefined;
    get priority(): number | undefined;
    get createdAt(): Date;
    get updatedAt(): Date;
    /**
     * Update wish properties
     */
    update(props: UpdateWishProps): Wish;
    /**
     * Check if wish belongs to user
     */
    belongsToUser(userId: string): boolean;
    /**
     * Check if wish belongs to group
     */
    belongsToGroup(groupId: string): boolean;
    /**
     * Convert to plain object for persistence
     */
    toObject(): WishProps;
}
//# sourceMappingURL=Wish.d.ts.map