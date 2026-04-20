const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');

// GET all stock items
router.get('/', async (req, res) => {
  try {
    const stock = await Stock.find();
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET stock by ID
router.get('/:id', async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ error: 'Stock item not found' });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create stock
router.post('/', async (req, res) => {
  try {
    const stock = new Stock(req.body);
    await stock.save();
    res.status(201).json({ success: true, stock });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update stock
router.put('/:id', async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!stock) return res.status(404).json({ error: 'Stock item not found' });
    res.json({ success: true, stock });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE stock
router.delete('/:id', async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ error: 'Stock item not found' });
    res.json({ success: true, message: 'Stock item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET low stock items
router.get('/low-stock/alert', async (req, res) => {
  try {
    const lowStock = await Stock.find({
      $expr: { $lte: ['$quantity', '$minimumStock'] },
    });
    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
