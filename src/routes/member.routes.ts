import { Router } from 'express';
import MemberController from '../controllers/user.controller';
import { ROLES } from '../database';
import { checkJwt, checkLogedOut } from '../middlewares/checkJwt';
import checkRole from '../middlewares/checkRole';
import {checkMdp, memberValidation} from '../middlewares/memberValidation'

const memberRoutes = Router();

//Get all users
memberRoutes.get('/', [checkJwt, checkRole])

// Get one user
.get('/:id', [checkJwt, checkRole],)

.post('/signin', [checkLogedOut, memberValidation(ROLES.MEMBER)], MemberController.newMember)

//Edit logedin user
.put('/',[checkJwt, checkMdp, memberValidation(ROLES.MEMBER, true)], MemberController.editMember)

//Delete one user
.delete('/:id',[checkJwt, checkRole])

export default memberRoutes;