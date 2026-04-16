/**
 * Group Use Cases - Index
 * Export all group-related use cases
 */

export { CreateGroupUseCase, toResponseDTO } from "./CreateGroupUseCase";
export { GetGroupDetailsUseCase } from "./GetGroupDetailsUseCase";
export { GetUserGroupsUseCase } from "./GetUserGroupsUseCase";
export { UpdateGroupUseCase } from "./UpdateGroupUseCase";
export { AddMemberToGroupUseCase } from "./AddMemberToGroupUseCase";
export { AddMemberByEmailUseCase } from "./AddMemberByEmailUseCase";
export { RemoveMemberFromGroupUseCase } from "./RemoveMemberFromGroupUseCase";
export { DeleteGroupUseCase } from "./DeleteGroupUseCase";
export { LeaveGroupUseCase } from "./LeaveGroupUseCase";

// Invitation Use Cases
export { AcceptInvitationUseCase } from "./AcceptInvitationUseCase";
export { RejectInvitationUseCase } from "./RejectInvitationUseCase";

// Raffle Use Cases
export {
  PerformRaffleUseCase,
  PerformRaffleDTO,
  RaffleResultDTO,
  RaffleFailedError,
} from "./PerformRaffleUseCase";
export {
  GetMyAssignmentUseCase,
  GetMyAssignmentDTO,
  AssignmentResultDTO,
  RaffleNotCompletedError,
  AssignmentNotFoundError,
} from "./GetMyAssignmentUseCase";

// Wish Use Cases
export { AddWishUseCase } from "./AddWishUseCase";
export { UpdateWishUseCase } from "./UpdateWishUseCase";
export { DeleteWishUseCase } from "./DeleteWishUseCase";
export { GetMyWishesUseCase } from "./GetMyWishesUseCase";
export { GetSecretSantaWishesUseCase } from "./GetSecretSantaWishesUseCase";

// Assignment Use Cases (cross-group)
export {
  GetAllMyAssignmentsUseCase,
  GetAllMyAssignmentsDTO,
  MyAssignmentSummaryDTO,
} from "./GetAllMyAssignmentsUseCase";

// User Use Cases
export {
  GetUserPublicProfileUseCase,
  UserNotFoundError,
} from "./GetUserPublicProfileUseCase";
