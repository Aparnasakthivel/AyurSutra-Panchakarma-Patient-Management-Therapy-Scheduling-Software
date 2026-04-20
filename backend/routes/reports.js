const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// GET all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialization');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId');
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create report
router.post('/', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    await report.populate('patientId', 'name email');
    await report.populate('doctorId', 'name specialization');
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update report
router.put('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialization');
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ success: true, report });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE report
router.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
