const fs = require('fs');
const path = require('path');
const configPath =path.resolve(__dirname, '../seeds/config.json');

// get current budget
const getBudget = (req, res) => {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    res.status(200).json({ budget: config.budget });
  } catch (error) {
    console.error("Error retrieving budget:", error);
    res.status(500).json({ message: "Unable to retrieve budget" });
  }
};

// renew current budget
// renew current budget
const updateBudget = (req, res) => {
  console.log('Received update request with data:', req.body);
  const { budget } = req.body; 

  // make sure number is valid
  if (!budget || isNaN(parseFloat(budget))) {
    return res.status(400).json({ message: "Invalid budget amount provided" });
  }

  try {
    const config = { budget: parseFloat(budget) };
    fs.writeFileSync(configPath, JSON.stringify(config), 'utf-8');
    res.status(200).json({ message: "Budget updated successfully", budget: config.budget });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Failed to update budget" });
  }
};


/*
const updateBudget = (req, res) => {
  console.log('Received update request with data:', req.body);
  const { newBudget } = req.body;

  // make sure number is valid
  if (!newBudget || isNaN(parseFloat(newBudget))) {
    return res.status(400).json({ message: "Invalid budget amount provided" });
  }

  try {
    const config = { budget: parseFloat(newBudget) };
    fs.writeFileSync(configPath, JSON.stringify(config), 'utf-8');
    res.status(200).json({ message: "Budget updated successfully", budget: config.budget });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Failed to update budget" });
  }
};

*/

// getBudgetForCurrentMonth
const getBudgetForCurrentMonth = async () => {
  try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return config.budget; 
  } catch (error) {
      console.error("Error retrieving budget for the current month:", error);
      throw new Error("Unable to retrieve budget for the current month");
  }
};


module.exports = {
  getBudget,
  updateBudget,
  getBudgetForCurrentMonth,
};
