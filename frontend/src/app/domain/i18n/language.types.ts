export type Language = 'en' | 'es';

export interface ITranslationDictionary {
  // Auth - Login
  loginWelcomeBack: string;
  loginSubtitle: string;
  loginEmailLabel: string;
  loginEmailRequired: string;
  loginEmailInvalid: string;
  loginPasswordLabel: string;
  loginPasswordRequired: string;
  loginPasswordMinLength: string;
  loginSigningIn: string;
  loginSignIn: string;
  loginOr: string;
  loginContinueWithGoogle: string;
  loginNoAccount: string;
  loginCreateOne: string;

  // Auth - Register
  registerCreateAccount: string;
  registerSubtitle: string;
  registerFullNameLabel: string;
  registerNameRequired: string;
  registerNameMinLength: string;
  registerEmailLabel: string;
  registerEmailRequired: string;
  registerEmailInvalid: string;
  registerPasswordLabel: string;
  registerPasswordRequired: string;
  registerPasswordMinLength: string;
  registerConfirmPasswordLabel: string;
  registerPasswordMismatch: string;
  registerCreatingAccount: string;
  registerContinueWithGoogle: string;
  registerAlreadyHaveAccount: string;
  registerSignIn: string;

  // Navigation / Layout
  navDashboard: string;
  navGroups: string;
  navProfile: string;
  navLogout: string;

  // Dashboard
  dashboardWelcome: string;
  dashboardHello: string;
  dashboardLoadingAssignments: string;
  dashboardAssignmentsTitle: string;
  dashboardBudget: string;
  dashboardLoading: string;
  dashboardNoAssignments: string;
  dashboardNoAssignmentsDesc: string;

  // Group List
  groupListTitle: string;
  groupListCreate: string;
  groupListSearchPlaceholder: string;
  groupListLoading: string;
  groupListNoGroups: string;
  groupListNoGroupsDesc: string;
  groupListCreateFirst: string;
  groupListTryAgain: string;
  groupListPendingInvitations: string;
  groupListPending: string;
  groupListInvitedDescription: string;
  groupListReject: string;
  groupListAccept: string;
  groupListRejecting: string;
  groupListAccepting: string;

  // Group Detail
  groupDetailBack: string;
  groupDetailLoading: string;
  groupDetailMember: string;
  groupDetailMembers: string;
  groupDetailRaffleComplete: string;
  groupDetailRafflePending: string;
  groupDetailInvitationPending: string;
  groupDetailInvitedToJoin: string;
  groupDetailInvitationDesc: string;
  groupDetailRejectInvitation: string;
  groupDetailAcceptInvitation: string;
  groupDetailRejecting: string;
  groupDetailAccepting: string;
  groupDetailBackToGroups: string;

  // Group Create
  groupCreateTitle: string;
  groupCreateBack: string;
  groupCreateNameLabel: string;
  groupCreateNameRequired: string;
  groupCreateNameMinLength: string;
  groupCreateNameMaxLength: string;
  groupCreateDescriptionLabel: string;
  groupCreateDescriptionOptional: string;
  groupCreateDescriptionMaxLength: string;
  groupCreateBudgetLabel: string;
  groupCreateBudgetRequired: string;
  groupCreateBudgetMin: string;
  groupCreateSubmitting: string;
  groupCreateSubmit: string;
  groupCreateCancel: string;

  // Wish List
  wishListTitle: string;
  wishListAddWish: string;
  wishListLoading: string;
  wishListNoWishes: string;
  wishListNoWishesDesc: string;
  wishListRetry: string;

  // Profile
  profileTitle: string;
  profileBack: string;
  profileSaving: string;
  profileSave: string;
  profileChangePhoto: string;
  profileUploadPhoto: string;

  // Language selector
  langSelectorLabel: string;
}
