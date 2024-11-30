const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const expenseController = require('../controllers/expenseController')

router.use((req, res, next) => {
  console.log('Expense route accessed:', req.path);
  next();
});

router.use(auth);


router.get('/', auth, async (req, res) => {
    console.log('User making request:', req.user);
    // Your expense handling logic
  });
  
  
router.get('/me', expenseController.getExpenses);
router.post('/', expenseController.addExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
