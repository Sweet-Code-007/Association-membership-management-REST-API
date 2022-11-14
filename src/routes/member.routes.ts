import { Router } from 'express';
import MemberController from '../controllers/user.controller';
import { ROLES } from '../database';
import { checkJwt, checkLogedOut } from '../middlewares/checkJwt';
import checkRole from '../middlewares/checkRole';
import {checkMdp, memberValidation} from '../middlewares/memberValidation'
import normalizeQuery from '../middlewares/queryNormalize';

const memberRoutes = Router();


memberRoutes/* .get('/:id', MemberController.getById) */

.get('/', [normalizeQuery(['inscriptionDate','role','firstName', 'lastName'])], MemberController.getAll)

.post('/signin', [checkLogedOut, memberValidation(ROLES.MEMBER)], MemberController.newMember)

//Edit logedin user
.put('/',[checkJwt, checkMdp, memberValidation(ROLES.MEMBER, true)], MemberController.editMember)

export default memberRoutes;