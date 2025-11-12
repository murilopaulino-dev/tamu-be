import express from 'express';
import { createCompany, getCompany, getCompanyModules } from '../controllers/company';
import { authenticateUser } from '../middlewares/auth';
import { InternalUserRole } from '../types/internalUser';
import { validateRequest } from '../validators';
import { createCompanyValidator } from '../validators/company';

const router = express.Router();

/**
 * @swagger
 * /api/companies/create:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - cnpj
 *               - password
 *               - passwordConfirm
 *             properties:
 *               name:
 *                 type: string
 *                 example: Example
 *               email:
 *                 type: string
 *                 example: example@example.com
 *               cnpj:
 *                 type: string
 *                 example: 99.999.999/0001-99
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing name, email, cnpj, password or passwordConfirm
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post(
  '/create',
  validateRequest(createCompanyValidator),
  authenticateUser([InternalUserRole.SUPER_ADMIN]),
  createCompany
);

/**
 * @swagger
 * /api/companies/:companyId:
 *   get:
 *     summary: Get company
 *     tags: [Companies]
 *     responses:
 *       201:
 *         description: Success
 *       401:
 *         description: Insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.get('/:companyId', authenticateUser(), getCompany);

router.get(
  '/:companyId/modules',
  getCompanyModules
);

export default router;
