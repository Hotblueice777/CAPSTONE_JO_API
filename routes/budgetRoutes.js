const express = require('express');
const router = express.Router();
const { getBudget, updateBudget, } = require('../controllers/budgetController');
const { getFinancialStatus } = require('../controllers/financialStatusController');

router.get('/', getBudget);
router.put('/', updateBudget);

router.get('/financial-status', getFinancialStatus);

module.exports = router;
