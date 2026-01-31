/**
 * Group Routes
 * Express routes for group management endpoints
 */
import { Router } from 'express';
import { GroupController } from '../controllers/GroupController';
import { authMiddleware } from '../middleware/authMiddleware';
import { IGroupRepository } from '../../../ports/IGroupRepository';

export function createGroupRoutes(groupRepository: IGroupRepository): Router {
  const router = Router();
  const groupController = new GroupController(groupRepository);

  // All group routes require authentication
  router.use(authMiddleware);

  // Group CRUD operations
  router.post('/', (req, res) => groupController.createGroup(req, res));
  router.get('/', (req, res) => groupController.getGroups(req, res));
  router.get('/:id', (req, res) => groupController.getGroupById(req, res));
  router.put('/:id', (req, res) => groupController.updateGroup(req, res));
  router.delete('/:id', (req, res) => groupController.deleteGroup(req, res));

  // Group member operations
  router.post('/:id/members', (req, res) => groupController.addMember(req, res));
  router.delete('/:id/members/:userId', (req, res) => groupController.removeMember(req, res));

  return router;
}
