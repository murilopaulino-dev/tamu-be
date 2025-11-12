import express from 'express';
import { createUser, deleteUser, getUsers } from '../controllers/user';
import { authenticateUser } from '../middlewares/auth';
import { InternalUserRole } from '../types/internalUser';

const router = express.Router();

router.post('/', createUser);

router.get('/', getUsers);

router.delete(
  '/:userId',
  authenticateUser([InternalUserRole.SUPER_ADMIN, InternalUserRole.OWNER, InternalUserRole.ADMIN]),
  deleteUser
);

export default router;
