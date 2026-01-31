import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as functions from "firebase-functions";
import { createGroupRoutes } from "./adapters/http/routes/groupRoutes";
import { createWishRoutes } from "./adapters/http/routes/wishRoutes";
import { FirebaseGroupRepository } from "./adapters/persistence/FirebaseGroupRepository";
import { FirebaseAssignmentRepository } from "./adapters/persistence/FirebaseAssignmentRepository";
import { FirebaseWishRepository } from "./adapters/persistence/FirebaseWishRepository";

dotenv.config();

const app = express();

// Initialize repositories
const groupRepository = new FirebaseGroupRepository();
const assignmentRepository = new FirebaseAssignmentRepository();
const wishRepository = new FirebaseWishRepository();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use(
  "/api/groups",
  createGroupRoutes(groupRepository, assignmentRepository),
);
app.use(
  "/api/groups/:groupId/wishes",
  createWishRoutes(wishRepository, groupRepository, assignmentRepository),
);

// Export for Firebase Functions
export const api = functions.https.onRequest(app);

// Local development server - only start when running directly (not when imported by Firebase)
const isMainModule = require.main === module;
const isLocalDev =
  process.env.NODE_ENV !== "production" && !process.env.FUNCTIONS_EMULATOR;

if (isMainModule && isLocalDev) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
