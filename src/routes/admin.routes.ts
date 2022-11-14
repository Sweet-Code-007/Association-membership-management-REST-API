import { Router } from 'express';
import MemberController from '../controllers/user.controller';
import { ROLES } from '../database';
import { checkJwt } from '../middlewares/checkJwt';
import checkRole from '../middlewares/checkRole';
import {memberValidation} from '../middlewares/memberValidation'

const adminRoutes = Router();

adminRoutes.post('/add-new-admin', [checkJwt, checkRole([ROLES.ADMIN]) ,memberValidation(ROLES.ADMIN)], MemberController.newMember)

export default adminRoutes;