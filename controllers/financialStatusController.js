const { getBudgetForCurrentMonth } = require('./budgetController');
const { getExpensesForCurrentMonth } = require('./expenseController');

const getFinancialStatus = async (req, res) => {
  try {
    const budget = await getBudgetForCurrentMonth();
    const expenses = await getExpensesForCurrentMonth();
    
    // const totalExpenses = expenses.length > 0 ? expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0) : 0;------test------

    const currentBalance = budget - expenses;

    let statusMessage;
    if (expenses === 0) {
      statusMessage = { type: 'info', message: "No expenses recorded for the current month." };
    } else if (currentBalance > 0) {
        statusMessage = { type: 'congratulations', message: `As of now, you still have ${currentBalance} in savings!` };
    } else if (currentBalance < 0) {
        statusMessage = { type: 'warning', message: `So far, you've overspent ${Math.abs(currentBalance)}` };
    } else {
        statusMessage = { type: 'neutral', message: "So far, you've just broken even!" };
    }

    res.json({
      budget,
      expenses,
      currentBalance,
      statusMessage
    });
    
  } catch (error) {
    console.error("Error retrieving financial status:", error);
    res.status(500).json({ message: "Unable to retrieve financial status", error: error.message });
  }
};

module.exports = {
  getFinancialStatus,
};
