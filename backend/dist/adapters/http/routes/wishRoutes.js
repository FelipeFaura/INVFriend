"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWishRoutes = createWishRoutes;
/**
 * Wish Routes
 * Express routes for wish management endpoints
 */
const express_1 = require("express");
const WishController_1 = require("../controllers/WishController");
const authMiddleware_1 = require("../middleware/authMiddleware");
function createWishRoutes(wishRepository, groupRepository, assignmentRepository) {
    const router = (0, express_1.Router)({ mergeParams: true }); // mergeParams to access :groupId from parent
    const wishController = new WishController_1.WishController(wishRepository, groupRepository, assignmentRepository);
    // All wish routes require authentication
    router.use(authMiddleware_1.authMiddleware);
    // Wish CRUD operations
    router.post("/", (req, res) => wishController.createWish(req, res));
    router.get("/", (req, res) => wishController.getMyWishes(req, res));
    router.get("/assigned", (req, res) => wishController.getAssignedWishes(req, res));
    router.put("/:wishId", (req, res) => wishController.updateWish(req, res));
    router.delete("/:wishId", (req, res) => wishController.deleteWish(req, res));
    return router;
}
//# sourceMappingURL=wishRoutes.js.map