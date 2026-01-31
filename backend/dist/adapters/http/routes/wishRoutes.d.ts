/**
 * Wish Routes
 * Express routes for wish management endpoints
 */
import { Router } from "express";
import { IWishRepository } from "../../../ports/IWishRepository";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../../ports/IAssignmentRepository";
export declare function createWishRoutes(wishRepository: IWishRepository, groupRepository: IGroupRepository, assignmentRepository: IAssignmentRepository): Router;
//# sourceMappingURL=wishRoutes.d.ts.map