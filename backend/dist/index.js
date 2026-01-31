"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const functions = __importStar(require("firebase-functions"));
const groupRoutes_1 = require("./adapters/http/routes/groupRoutes");
const wishRoutes_1 = require("./adapters/http/routes/wishRoutes");
const FirebaseGroupRepository_1 = require("./adapters/persistence/FirebaseGroupRepository");
const FirebaseAssignmentRepository_1 = require("./adapters/persistence/FirebaseAssignmentRepository");
const FirebaseWishRepository_1 = require("./adapters/persistence/FirebaseWishRepository");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Initialize repositories
const groupRepository = new FirebaseGroupRepository_1.FirebaseGroupRepository();
const assignmentRepository = new FirebaseAssignmentRepository_1.FirebaseAssignmentRepository();
const wishRepository = new FirebaseWishRepository_1.FirebaseWishRepository();
// Middleware
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
// Health check
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// API Routes
app.use("/api/groups", (0, groupRoutes_1.createGroupRoutes)(groupRepository, assignmentRepository));
app.use("/api/groups/:groupId/wishes", (0, wishRoutes_1.createWishRoutes)(wishRepository, groupRepository, assignmentRepository));
// Export for Firebase Functions
exports.api = functions.https.onRequest(app);
// Local development server
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}
//# sourceMappingURL=index.js.map