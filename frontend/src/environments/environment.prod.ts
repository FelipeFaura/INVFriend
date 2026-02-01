/**
 * Production environment configuration
 */
export const environment = {
  production: true,
  apiUrl: "/api",
  tokenRefreshThreshold: 300, // Refresh token 5 minutes before expiry
  firebase: {
    projectId: "invfriend",
    appId: "1:33325027952:web:53b06d8c4b04d7463adab5",
    storageBucket: "invfriend.firebasestorage.app",
    apiKey: "AIzaSyAplJS0peer_YFksxqjwX4-xq9h9AwzFfY",
    authDomain: "invfriend.firebaseapp.com",
    messagingSenderId: "33325027952",
  },
};
