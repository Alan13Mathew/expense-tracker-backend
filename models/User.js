const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the embedded expense schema
const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  date: { type: Date, default: Date.now }
});

// Enhanced user schema with embedded expenses
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  expenses: [expenseSchema]  // Embedded expenses array
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
