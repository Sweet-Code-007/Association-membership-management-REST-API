import { Router } from 'express';
import MemberController from '../controllers/user.controller';
import { ROLES } from '../database';
import { checkJwt } from '../middlewares/checkJwt';
import checkRole from '../middlewares/checkRole';
import {memberValidation} from '../middlewares/memberValidation'

const adminRoutes = Router();

//Get all users
adminRoutes.post('/add-new-admin', [checkJwt, checkRole([ROLES.ADMIN]) ,memberValidation(ROLES.ADMIN)], MemberController.newMember)

//Edit one user
// .put('/:id',[checkJwt, checkRole])

//Delete one user
.delete('/:id',[checkJwt, checkRole])

export default adminRoutes;