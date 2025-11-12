import express from 'express';
import { createInternalUser, deleteInternalUser, getInternalUsers } from '../controllers/internalUser';
import { authenticateUser } from '../middlewares/auth';
import { InternalUserRole } from '../types/internalUser';

const router = express.Router();

router.post('/', createInternalUser);

router.get('/', getInternalUsers);

router.delete(
  '/:internalUserId',
  authenticateUser([InternalUserRole.SUPER_ADMIN, InternalUserRole.OWNER, InternalUserRole.ADMIN]),
  deleteInternalUser
);

export default router;
