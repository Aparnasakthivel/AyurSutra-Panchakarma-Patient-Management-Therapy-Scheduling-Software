const express = require('express');
const router = express.Router();
const Therapy = require('../models/Therapy');

// GET all therapies
router.get('/', async (req, res) => {
  try {
    const therapies = await Therapy.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialization');
    res.json(therapies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET therapy by ID
router.get('/:id', async (req, res) => {
  try {
    const therapy = await Therapy.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId');
    if (!therapy) return res.status(404).json({ error: 'Therapy not found' });
    res.json(therapy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create therapy
router.post('/', async (req, res) => {
  try {
    const therapy = new Therapy(req.body);
    await therapy.save();
    await therapy.populate('patientId', 'name email');
    await therapy.populate('doctorId', 'name specialization');
    res.status(201).json({ success: true, therapy });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update therapy
router.put('/:id', async (req, res) => {
  try {
    const therapy = await Therapy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialization');
    if (!therapy) return res.status(404).json({ error: 'Therapy not found' });
    res.json({ success: true, therapy });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE therapy
router.delete('/:id', async (req, res) => {
  try {
    const therapy = await Therapy.findByIdAndDelete(req.params.id);
    if (!therapy) return res.status(404).json({ error: 'Therapy not found' });
    res.json({ success: true, message: 'Therapy deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
