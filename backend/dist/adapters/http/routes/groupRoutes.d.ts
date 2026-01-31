/**
 * Group Routes
 * Express routes for group management endpoints
 */
import { Router } from "express";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../../ports/IAssignmentRepository";
export declare function createGroupRoutes(groupRepository: IGroupRepository, assignmentRepository: IAssignmentRepository): Router;
//# sourceMappingURL=groupRoutes.d.ts.map