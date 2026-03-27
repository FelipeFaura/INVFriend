/**
 * GetUserPublicProfileUseCase
 * Retrieves a user's public profile (name and photoUrl only)
 */
import { IUserRepository } from "../../ports/IUserRepository";

/** Input DTO */
export interface GetUserPublicProfileDTO {
  /** ID of the user whose profile to fetch */
  userId: string;
  /** ID of the authenticated requester */
  requesterId: string;
}

/** Output DTO - only public fields, no email or timestamps */
export interface UserPublicProfileResultDTO {
  id: string;
  name: string;
  photoUrl: string | null;
}

/** Error thrown when user is not found */
export class UserNotFoundError extends Error {
  constructor(message: string = "User not found") {
    super(message);
    this.name = "UserNotFoundError";
  }
}

/**
 * Use case for getting a user's public profile
 * Returns only name and photoUrl — never email or timestamps
 */
export class GetUserPublicProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Gets public profile for a user
   * @param dto - Input with userId and requesterId
   * @returns Public profile with id, name, and photoUrl
   * @throws UserNotFoundError if user doesn't exist
   */
  async execute(
    dto: GetUserPublicProfileDTO,
  ): Promise<UserPublicProfileResultDTO> {
    if (!dto.requesterId) {
      throw new Error("Authentication required");
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    return {
      id: user.id,
      name: user.name,
      photoUrl: user.photoUrl,
    };
  }
}
