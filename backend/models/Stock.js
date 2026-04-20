const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
    },
    unitCost: {
      type: Number,
      required: true,
    },
    supplier: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    lastRestocked: {
      type: Date,
      default: Date.now,
    },
    minimumStock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stock', stockSchema);
