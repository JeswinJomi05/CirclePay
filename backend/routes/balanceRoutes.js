import {getBalance,createBalance,updateBalance} from '../controllers/balanceController.js';
import express from 'express';

const router = express.Router();

router.get('/', getBalance);
router.post('/', createBalance);
router.put('/:id', updateBalance);

export default router;