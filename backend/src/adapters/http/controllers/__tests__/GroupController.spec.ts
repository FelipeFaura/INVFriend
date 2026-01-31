/**
 * Tests for GroupController
 * TDD approach - tests written first
 */
import { Response } from 'express';
import { GroupController } from '../GroupController';
import { IGroupRepository } from '../../../../ports/IGroupRepository';
import {
  GroupNotFoundError,
  NotGroupAdminError,
  NotGroupMemberError,
  AlreadyGroupMemberError,
  CannotRemoveAdminError,
  CannotDeleteAfterRaffleError,
  InvalidGroupNameError,
  InvalidBudgetLimitError,
} from '../../../../domain/errors/GroupErrors';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

// Mock all use cases
jest.mock('../../../../application/use-cases', () => ({
  CreateGroupUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
  GetGroupDetailsUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
  GetUserGroupsUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
  UpdateGroupUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
  AddMemberToGroupUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
  RemoveMemberFromGroupUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
  DeleteGroupUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
}));

describe('GroupController', () => {
  let controller: GroupController;
  let mockRepository: jest.Mocked<IGroupRepository>;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let jsonData: unknown;

  const mockUser = {
    uid: 'user-123',
    email: 'test@example.com',
  };

  const mockGroupResponse = {
    id: 'group-123',
    name: 'Secret Santa 2026',
    description: 'Christmas exchange',
    adminId: 'user-123',
    members: ['user-123'],
    budgetLimit: 50,
    raffleStatus: 'pending' as const,
    raffleDate: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByMemberId: jest.fn(),
      findByAdminId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      generateId: jest.fn(),
    };

    controller = new GroupController(mockRepository);

    jsonData = null;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((data) => {
        jsonData = data;
      }),
    };

    mockRequest = {
      body: {},
      params: {},
      user: mockUser,
    };
  });

  describe('createGroup', () => {
    it('should create a group successfully', async () => {
      mockRequest.body = {
        name: 'Secret Santa 2026',
        budgetLimit: 50,
        description: 'Christmas exchange',
      };

      const { CreateGroupUseCase } = require('../../../../application/use-cases');
      const mockExecute = jest.fn().mockResolvedValue(mockGroupResponse);
      CreateGroupUseCase.mockImplementation(() => ({ execute: mockExecute }));

      controller = new GroupController(mockRepository);

      await controller.createGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(jsonData).toEqual(mockGroupResponse);
    });

    it('should return 401 when user is not authenticated', async () => {
      mockRequest.user = undefined;

      await controller.createGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect((jsonData as { code: string }).code).toBe('UNAUTHORIZED');
    });

    it('should return 400 for invalid group name', async () => {
      mockRequest.body = { name: 'AB', budgetLimit: 50 };

      const { CreateGroupUseCase } = require('../../../../application/use-cases');
      CreateGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new InvalidGroupNameError()),
      }));

      controller = new GroupController(mockRepository);

      await controller.createGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect((jsonData as { code: string }).code).toBe('INVALID_GROUP_NAME');
    });

    it('should return 400 for invalid budget', async () => {
      mockRequest.body = { name: 'Valid Name', budgetLimit: 0 };

      const { CreateGroupUseCase } = require('../../../../application/use-cases');
      CreateGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new InvalidBudgetLimitError()),
      }));

      controller = new GroupController(mockRepository);

      await controller.createGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect((jsonData as { code: string }).code).toBe('INVALID_BUDGET_LIMIT');
    });
  });

  describe('getGroups', () => {
    it('should return user groups successfully', async () => {
      const mockGroups = [
        {
          id: 'group-1',
          name: 'Group 1',
          description: null,
          memberCount: 3,
          budgetLimit: 50,
          raffleStatus: 'pending',
          isAdmin: true,
        },
      ];

      const { GetUserGroupsUseCase } = require('../../../../application/use-cases');
      GetUserGroupsUseCase.mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockGroups),
      }));

      controller = new GroupController(mockRepository);

      await controller.getGroups(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonData).toEqual({ groups: mockGroups });
    });

    it('should return 401 when user is not authenticated', async () => {
      mockRequest.user = undefined;

      await controller.getGroups(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });

  describe('getGroupById', () => {
    it('should return group details successfully', async () => {
      mockRequest.params = { id: 'group-123' };

      const { GetGroupDetailsUseCase } = require('../../../../application/use-cases');
      GetGroupDetailsUseCase.mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(mockGroupResponse),
      }));

      controller = new GroupController(mockRepository);

      await controller.getGroupById(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonData).toEqual(mockGroupResponse);
    });

    it('should return 404 when group not found', async () => {
      mockRequest.params = { id: 'non-existent' };

      const { GetGroupDetailsUseCase } = require('../../../../application/use-cases');
      GetGroupDetailsUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new GroupNotFoundError('non-existent')),
      }));

      controller = new GroupController(mockRepository);

      await controller.getGroupById(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect((jsonData as { code: string }).code).toBe('GROUP_NOT_FOUND');
    });

    it('should return 403 when user is not a member', async () => {
      mockRequest.params = { id: 'group-123' };

      const { GetGroupDetailsUseCase } = require('../../../../application/use-cases');
      GetGroupDetailsUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(
          new NotGroupMemberError('You must be a member to view group details'),
        ),
      }));

      controller = new GroupController(mockRepository);

      await controller.getGroupById(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect((jsonData as { code: string }).code).toBe('NOT_GROUP_MEMBER');
    });
  });

  describe('updateGroup', () => {
    it('should update group successfully', async () => {
      mockRequest.params = { id: 'group-123' };
      mockRequest.body = { name: 'Updated Name' };

      const updatedGroup = { ...mockGroupResponse, name: 'Updated Name' };

      const { UpdateGroupUseCase } = require('../../../../application/use-cases');
      UpdateGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(updatedGroup),
      }));

      controller = new GroupController(mockRepository);

      await controller.updateGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect((jsonData as typeof mockGroupResponse).name).toBe('Updated Name');
    });

    it('should return 403 when user is not admin', async () => {
      mockRequest.params = { id: 'group-123' };
      mockRequest.body = { name: 'Updated Name' };

      const { UpdateGroupUseCase } = require('../../../../application/use-cases');
      UpdateGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new NotGroupAdminError()),
      }));

      controller = new GroupController(mockRepository);

      await controller.updateGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect((jsonData as { code: string }).code).toBe('NOT_GROUP_ADMIN');
    });

    it('should return 404 when group not found', async () => {
      mockRequest.params = { id: 'non-existent' };
      mockRequest.body = { name: 'Updated' };

      const { UpdateGroupUseCase } = require('../../../../application/use-cases');
      UpdateGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new GroupNotFoundError('non-existent')),
      }));

      controller = new GroupController(mockRepository);

      await controller.updateGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteGroup', () => {
    it('should delete group successfully', async () => {
      mockRequest.params = { id: 'group-123' };

      const { DeleteGroupUseCase } = require('../../../../application/use-cases');
      DeleteGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(undefined),
      }));

      controller = new GroupController(mockRepository);

      await controller.deleteGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect((jsonData as { success: boolean }).success).toBe(true);
    });

    it('should return 403 when user is not admin', async () => {
      mockRequest.params = { id: 'group-123' };

      const { DeleteGroupUseCase } = require('../../../../application/use-cases');
      DeleteGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new NotGroupAdminError()),
      }));

      controller = new GroupController(mockRepository);

      await controller.deleteGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it('should return 400 when raffle already completed', async () => {
      mockRequest.params = { id: 'group-123' };

      const { DeleteGroupUseCase } = require('../../../../application/use-cases');
      DeleteGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new CannotDeleteAfterRaffleError()),
      }));

      controller = new GroupController(mockRepository);

      await controller.deleteGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect((jsonData as { code: string }).code).toBe('CANNOT_DELETE_AFTER_RAFFLE');
    });
  });

  describe('addMember', () => {
    it('should add member successfully', async () => {
      mockRequest.params = { id: 'group-123' };
      mockRequest.body = { userId: 'new-member' };

      const updatedGroup = {
        ...mockGroupResponse,
        members: ['user-123', 'new-member'],
      };

      const { AddMemberToGroupUseCase } = require('../../../../application/use-cases');
      AddMemberToGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(updatedGroup),
      }));

      controller = new GroupController(mockRepository);

      await controller.addMember(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect((jsonData as typeof mockGroupResponse).members).toContain('new-member');
    });

    it('should return 403 when user is not admin', async () => {
      mockRequest.params = { id: 'group-123' };
      mockRequest.body = { userId: 'new-member' };

      const { AddMemberToGroupUseCase } = require('../../../../application/use-cases');
      AddMemberToGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new NotGroupAdminError()),
      }));

      controller = new GroupController(mockRepository);

      await controller.addMember(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it('should return 400 when user is already a member', async () => {
      mockRequest.params = { id: 'group-123' };
      mockRequest.body = { userId: 'user-123' };

      const { AddMemberToGroupUseCase } = require('../../../../application/use-cases');
      AddMemberToGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new AlreadyGroupMemberError()),
      }));

      controller = new GroupController(mockRepository);

      await controller.addMember(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect((jsonData as { code: string }).code).toBe('ALREADY_GROUP_MEMBER');
    });
  });

  describe('removeMember', () => {
    it('should remove member successfully', async () => {
      mockRequest.params = { id: 'group-123', userId: 'member-456' };

      const updatedGroup = { ...mockGroupResponse, members: ['user-123'] };

      const { RemoveMemberFromGroupUseCase } = require('../../../../application/use-cases');
      RemoveMemberFromGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(updatedGroup),
      }));

      controller = new GroupController(mockRepository);

      await controller.removeMember(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 403 when user is not admin', async () => {
      mockRequest.params = { id: 'group-123', userId: 'member-456' };

      const { RemoveMemberFromGroupUseCase } = require('../../../../application/use-cases');
      RemoveMemberFromGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new NotGroupAdminError()),
      }));

      controller = new GroupController(mockRepository);

      await controller.removeMember(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it('should return 400 when trying to remove admin', async () => {
      mockRequest.params = { id: 'group-123', userId: 'user-123' };

      const { RemoveMemberFromGroupUseCase } = require('../../../../application/use-cases');
      RemoveMemberFromGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new CannotRemoveAdminError()),
      }));

      controller = new GroupController(mockRepository);

      await controller.removeMember(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect((jsonData as { code: string }).code).toBe('CANNOT_REMOVE_ADMIN');
    });

    it('should return 400 when user is not a member', async () => {
      mockRequest.params = { id: 'group-123', userId: 'unknown' };

      const { RemoveMemberFromGroupUseCase } = require('../../../../application/use-cases');
      RemoveMemberFromGroupUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new NotGroupMemberError()),
      }));

      controller = new GroupController(mockRepository);

      await controller.removeMember(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect((jsonData as { code: string }).code).toBe('NOT_GROUP_MEMBER');
    });
  });
});
