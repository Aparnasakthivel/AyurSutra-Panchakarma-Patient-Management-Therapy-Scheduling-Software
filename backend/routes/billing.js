const express = require('express');
const router = express.Router();
const Billing = require('../models/Billing');

// GET all billings
router.get('/', async (req, res) => {
  try {
    const billings = await Billing.find()
      .populate('patientId', 'name email')
      .populate('therapyId', 'name');
    res.json(billings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET billing by ID
router.get('/:id', async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id)
      .populate('patientId')
      .populate('therapyId');
    if (!billing) return res.status(404).json({ error: 'Billing not found' });
    res.json(billing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create billing
router.post('/', async (req, res) => {
  try {
    const billing = new Billing(req.body);
    await billing.save();
    await billing.populate('patientId', 'name email');
    await billing.populate('therapyId', 'name');
    res.status(201).json({ success: true, billing });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update billing
router.put('/:id', async (req, res) => {
  try {
    const billing = await Billing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('patientId', 'name email')
      .populate('therapyId', 'name');
    if (!billing) return res.status(404).json({ error: 'Billing not found' });
    res.json({ success: true, billing });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE billing
router.delete('/:id', async (req, res) => {
  try {
    const billing = await Billing.findByIdAndDelete(req.params.id);
    if (!billing) return res.status(404).json({ error: 'Billing not found' });
    res.json({ success: true, message: 'Billing deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET pending payments
router.get('/pending/list', async (req, res) => {
  try {
    const pending = await Billing.find({
      paymentStatus: { $in: ['Pending', 'PartiallyPaid'] },
    })
      .populate('patientId', 'name email');
    res.json(pending);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
