import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { ROLES } from '../database';
import { checkJwt, checkLogedOut } from '../middlewares/checkJwt';
import { checkMdp, memberValidation } from '../middlewares/memberValidation';

const authRoutes = Router();

authRoutes.post("/login", [checkLogedOut, checkMdp], AuthController.login)

//change my password
.put("/change-password", [checkJwt, checkMdp, memberValidation(ROLES.MEMBER, true, true)], AuthController.changePassword)

//logout
.post("/logout", [checkJwt], AuthController.logout)

export default authRoutes;