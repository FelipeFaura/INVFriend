"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroupRoutes = createGroupRoutes;
/**
 * Group Routes
 * Express routes for group management endpoints
 */
const express_1 = require("express");
const GroupController_1 = require("../controllers/GroupController");
const RaffleController_1 = require("../controllers/RaffleController");
const authMiddleware_1 = require("../middleware/authMiddleware");
function createGroupRoutes(groupRepository, assignmentRepository) {
    const router = (0, express_1.Router)();
    const groupController = new GroupController_1.GroupController(groupRepository);
    const raffleController = new RaffleController_1.RaffleController(groupRepository, assignmentRepository);
    // All group routes require authentication
    router.use(authMiddleware_1.authMiddleware);
    // Group CRUD operations
    router.post("/", (req, res) => groupController.createGroup(req, res));
    router.get("/", (req, res) => groupController.getGroups(req, res));
    router.get("/:id", (req, res) => groupController.getGroupById(req, res));
    router.put("/:id", (req, res) => groupController.updateGroup(req, res));
    router.delete("/:id", (req, res) => groupController.deleteGroup(req, res));
    // Group member operations
    router.post("/:id/members", (req, res) => groupController.addMember(req, res));
    router.delete("/:id/members/:userId", (req, res) => groupController.removeMember(req, res));
    // Raffle operations
    router.post("/:id/raffle", (req, res) => raffleController.performRaffle(req, res));
    router.get("/:id/my-assignment", (req, res) => raffleController.getMyAssignment(req, res));
    return router;
}
//# sourceMappingURL=groupRoutes.js.map