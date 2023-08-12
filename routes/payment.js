import express from 'express'
import { getReciepts, makePayment } from "../controllers/payment.js"
import { isAuth } from "../middlewears/isAuth.js"

const router = express.Router()

router
.get("/getReciepts", isAuth, getReciepts)
.post("/makePayment", isAuth, makePayment)

export default router