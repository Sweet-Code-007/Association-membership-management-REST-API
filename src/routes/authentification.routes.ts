import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import MemberController from '../controllers/user.controller';
import { ROLES } from '../database';
import { checkJwt, checkLogedOut } from '../middlewares/checkJwt';
import checkRole from '../middlewares/checkRole';
import { checkMdp } from '../middlewares/memberValidation';

const authRoutes = Router();

authRoutes.post("/login", [checkLogedOut, checkMdp], AuthController.login)

//change my password
.post("/change-password", [checkJwt, checkMdp], AuthController.changePassword)

//logout
.post("/logout", [checkJwt], AuthController.logout)

export default authRoutes;