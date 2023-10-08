import express from 'express'
import { getReciepts, makePayment, searchPayments } from "../controllers/payment.js"
import { isAuth } from "../middlewears/isAuth.js"


const router = express.Router()

router
.get("/getReciepts", isAuth, getReciepts)
.get('/searchPayments/:refNumber', isAuth, searchPayments)
.post("/makePayment", isAuth, makePayment)

export default router