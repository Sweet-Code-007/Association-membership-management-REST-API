import Router from 'express';
import memberRoutes from './member.routes';

const router= Router()

router.use('/user', memberRoutes)

.use((req, res)=>{
    res.status(404).json({
        err: true,
        message: `Cannot ${req.method} ${req.url}`
    })
})

export default router;