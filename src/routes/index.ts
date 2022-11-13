import Router from 'express';

const router= Router()

router.use((req, res)=>{
    res.status(404).json({
        status: 404,
        message: `Cannot ${req.method} ${req.url}`
    })
})

export default router;