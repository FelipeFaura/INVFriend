/**
 * Wish DTOs
 * Data Transfer Objects for wish API communication
 */

/**
 * DTO for creating a new wish
 */
export interface CreateWishDTO {
  title: string;
  description?: string;
  url?: string;
  estimatedPrice?: number;
  priority?: number;
}

/**
 * DTO for updating a wish
 */
export interface UpdateWishDTO {
  title?: string;
  description?: string;
  url?: string;
  estimatedPrice?: number;
  priority?: number;
}

/**
 * Response DTO for a wish
 */
export interface WishResponseDTO {
  id: string;
  groupId: string;
  userId: string;
  title: string;
  description?: string;
  url?: string;
  estimatedPrice?: number;
  priority?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response DTO for list of wishes
 */
export interface WishListResponseDTO {
  wishes: WishResponseDTO[];
}

/**
 * Response DTO for delete operation
 */
export interface DeleteWishResponseDTO {
  success: boolean;
  message: string;
}

/**
 * Error response from backend
 */
export interface WishErrorResponseDTO {
  error: string;
  code: string;
  message: string;
}
