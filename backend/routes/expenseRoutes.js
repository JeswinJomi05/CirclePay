import { getExpenses, createExpense, updateExpense } from '../controllers/expenseController.js';
import express from 'express';

const router = express.Router();

router.get('/', getExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);

export default router;