const express = require('express');
const router = express.Router();
const { getExpense, getExpenseById, addExpense, editExpense,deleteExpenseById } = require('../controllers/expenseController');

router.get('/', getExpense);
router.get('/:id', getExpenseById);
router.post('/', addExpense);
router.delete('/:id', deleteExpenseById);
router.put('/:id', editExpense);


module.exports = router;
