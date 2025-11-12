import express from 'express';
import { createUser, deleteUser, getUsers } from '../controllers/user';
import { authenticateUser, checkCompanyOwnership } from '../middlewares/auth';
import UserModel from '../models/user/model';
import { InternalUserRole } from '../types/internalUser';

const router = express.Router();

router.post('/', createUser);

router.get('/', getUsers);

router.delete(
  '/:userId',
  checkCompanyOwnership(UserModel, 'userId', 'user'),
  authenticateUser([InternalUserRole.SUPER_ADMIN, InternalUserRole.OWNER, InternalUserRole.ADMIN]),
  deleteUser
);

export default router;
