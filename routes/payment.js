import express from 'express'
import { getReciepts, makePayment, searchPayments } from "../controllers/payment.js"
import { isAuth } from "../middlewears/isAuth.js"


const router = express.Router()

router
.get("/getReciepts/:userId", getReciepts)
.get('/searchPayments/:refNumber', searchPayments)
.post("/makePayment", makePayment)

export default router