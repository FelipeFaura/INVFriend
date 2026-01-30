/**
 * Production environment configuration
 */
export const environment = {
  production: true,
  apiUrl: "https://api.invfriend.com/api",
  tokenRefreshThreshold: 300, // Refresh token 5 minutes before expiry
};
