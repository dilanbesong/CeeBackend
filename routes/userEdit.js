import express from 'express'
import { userEdit } from '../middlewears/userEdit.js'

const router = express.Router()

router.put('/edit', userEdit)

export { router }