// models/Expense.js
const { sequelize, Sequelize } = require('./index');

const Expense = sequelize.define('Expense', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_name: { type: Sequelize.STRING },
  category: { type: Sequelize.STRING },
  amount: { type: Sequelize.FLOAT },
  date: { type: Sequelize.DATEONLY }
}, {
  timestamps: false,
  tableName: 'expenses'
});

module.exports = Expense;
