const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    therapyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapy',
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Check', 'Online'],
      default: 'Cash',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'PartiallyPaid', 'Refunded'],
      default: 'Pending',
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Billing', billingSchema);
