import Router from 'express';
import adminRoutes from './admin.routes';
import authRoutes from './authentification.routes';
import memberRoutes from './member.routes';

const router= Router()

router.use('/user', memberRoutes)

.use('/auth', authRoutes)

.use('/admin', adminRoutes)

.use((req, res)=>{
    res.status(404).json({
        err: true,
        message: `Cannot ${req.method} ${req.url}`
    })
})

export default router;