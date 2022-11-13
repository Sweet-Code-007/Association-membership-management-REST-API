import { Router } from 'express';
import MemberController from '../controllers/user.controller';
import { ROLES } from '../database';
import { checkJwt, checkLogedOut } from '../middlewares/checkJwt';
import checkRole from '../middlewares/checkRole';
import {memberValidation} from '../middlewares/memberValidation'

const memberRoutes = Router();

//Get all users
memberRoutes.get('/', [checkJwt, checkRole])

// Get one user
.get('/:id', [checkJwt, checkRole],)

.post('/signin', [checkLogedOut, memberValidation(ROLES.MEMBER)], MemberController.newMember)

//Edit one user
.put('/:id',[checkJwt, checkRole])

//Delete one user
.delete('/:id',[checkJwt, checkRole])

export default memberRoutes;