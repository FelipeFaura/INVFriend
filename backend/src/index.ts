import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createGroupRoutes } from "./adapters/http/routes/groupRoutes";
import { createWishRoutes } from "./adapters/http/routes/wishRoutes";
import { FirebaseGroupRepository } from "./adapters/persistence/FirebaseGroupRepository";
import { FirebaseAssignmentRepository } from "./adapters/persistence/FirebaseAssignmentRepository";
import { FirebaseWishRepository } from "./adapters/persistence/FirebaseWishRepository";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize repositories
const groupRepository = new FirebaseGroupRepository();
const assignmentRepository = new FirebaseAssignmentRepository();
const wishRepository = new FirebaseWishRepository();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
