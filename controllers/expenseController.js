const User = require('../models/User');

exports.addExpense = async (req, res) => {
  try {
    const { description, amount, category, type, date } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $push: { 
          expenses: {
            description,
            amount,
            category,
            type,
            date: date || new Date()
          }
        }
      },
      { new: true }
    );

    // Return the newly added expense
    const newExpense = updatedUser.expenses[updatedUser.expenses.length - 1];
    res.status(201).json(newExpense);
  } catch (error) {
    console.log('Expense creation error:', error);
    res.status(500).json({ message: 'Error adding expense' });
  }
};

exports.bulkExpense = async (req, res) => {
  try {
    const transactions = req.body;
    
    const user = await User.findById(req.user.id)
    
    const formattedTransactions = transactions.map(transaction => ({
      description: transaction.description,
      amount: Number(transaction.amount),
      category: transaction.category,
      type: transaction.type,
      date: new Date(transaction.date)
    }));

    

    user.expenses.push(...formattedTransactions);
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Transactions imported successfully',
      count: formattedTransactions.length
    });
  } catch (error) {
    console.log('Bulk import error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import transactions',
      error: error.message
    });
  }
};


exports.getExpenses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.expenses); // Directly send the expenses array
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses' });
  }
};


exports.deleteExpense = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { expenses: { _id: req.params.id } } }
    );
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense' });
  }
};

exports.getExpenseStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const stats = {
      total: 0,
      byCategory: []
    };
    
    user.expenses.forEach(expense => {
      stats.total += expense.amount;
      stats.byCategory.push({
        category: expense.category,
        amount: expense.amount
      });
    });
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};
