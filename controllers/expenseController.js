const knex = require("knex")(require("../knexfile"));

// GET /expenses - Get a list of all expenses
const getExpense = async (req, res) => {
  const { search, category, minAmount, maxAmount, date } = req.query;

  try {
    let query = knex("expenses");

    if (search) {
      query = query.where("user_name", "like", `%${search}%`);
    }

    if (category) {
      query = query.andWhere("category", "=", category);
    }

    if (minAmount) {
      query = query.andWhere("amount", ">=", minAmount);
    }

    if (maxAmount) {
      query = query.andWhere("amount", "<=", maxAmount);
    }

    if (date) {
      query = query.andWhere("date", "=", date);
    }

    const expenses = await query;
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving expenses. Please try again later." });
  }
};




// GET /expenses/:id for single expense

const getExpenseById = async (req, res) => {
  const { id } = req.params;  

  if (!id) {
    return res.status(400).json({ message: "Expense ID is required" });
  }

  try {
    const expense = await knex("expenses")
      .select("id", "user_name", "category", "amount", "date")
      .where({ id })
      .first();

    if (expense) {
      res.status(200).json(expense);
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    console.error("Error retrieving expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// POST/CREATE a new expense
const addExpense = async (req, res) => {
  const { user_name, category, amount } = req.body;
  const date = new Date().toISOString().slice(0, 10);  


  if (!user_name || !category || !amount) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  try {
    const response = await knex("expenses").insert({
      user_name,
      category,
      amount,
      date 
    });

    const newExpense = await knex
      .select("id", "user_name", "category", "amount", "date")
      .from("expenses")
      .where({ id: response[0] })
      .first();

    return res.status(201).json({
      message: "Expense added successfully",
      expense: newExpense
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add expense" });
  }
};



// PUT /expenses/:id
// PUT/UPDATE an existing expense

const editExpense = async (req, res) => {
  const { user_name, category, amount } = req.body;
  const { id } = req.params;
  
  if (!id || !user_name || !category || !amount) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  try {
    const rowsUpdated = await knex("expenses")
      .where({ id })
      .update({
        user_name,
        category,
        amount
      });

    if (rowsUpdated) {
      const updatedExpense = await knex("expenses")
        .select("id", "user_name", "category", "amount","date")    
        .where({ id })
        .first();
      return res.status(200).json({
        message: "Expense updated successfully",
        expense: updatedExpense
      });
    } else {
      return res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update expense" });
  }
};


  // Delete - /expenses/:id

  const deleteExpenseById = async (req, res) => {
    try {
      const deletedRows = await knex("expenses")
        .where({ id: req.params.id })
        .delete();

      if (deletedRows === 0) {
        return res.status(404).json({
          message: `Expense ID ${req.params.id} not found.`,
        });
      }

      res.status(204).json({ message: "Expense deleted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting expense", error: error.message });
    }
  };




  // getExpensesForCurrentMonth
  
  const Sequelize = require('sequelize');
  const { sequelize } = require('../models');
  const Expense = require('../models/Expense');
  
  const getExpensesForCurrentMonth = async () => {
      const currentDate = new Date();
      const currentMonth = currentDate.getUTCMonth() + 1; 
      const currentYear = currentDate.getUTCFullYear(); 
  
      try {
// -----------------------------test---------------------------------------
        console.log(`Querying for expenses in ${currentMonth}/${currentYear}`);
// -----------------------------test---------------------------------------

        const totalExpenses = await Expense.sum('amount', {
          where: {
              [Sequelize.Op.and]: [
                  sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), currentMonth),
                  sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), currentYear)
              ]
          }
      });
// -----------------------------test---------------------------------------
      console.log("Total expenses found: ", totalExpenses);
// -----------------------------test---------------------------------------

      return totalExpenses || 0;
      
      } catch (error) {
          console.error("Failed to get expenses for the current month:", error);
          throw error;
      }
  };
  

  module.exports = {
    getExpense,
    getExpenseById,
    addExpense,
    editExpense,
    deleteExpenseById,
    getExpensesForCurrentMonth,
  };


  