const express = require('express');
// const axios = require('axios');
const router = express.Router();
const Shelter = require('../models/shelter');

// Index
router.get('/', async (req, res) => {
  try {
    const shelters = await Shelter.find();
    res.status(200).json(shelters);
  } catch (err) {
    res.status(500).json({ message: err.message }); // returns 500 which means there was a server error
  };
});

// Show
router.get('/:shelterId', async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.shelterId);
    return res.status(200).json(shelter);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message})
  };
});

// Create
router.post('/', async (req, res) => {
  const shelter = new Shelter({
    name: req.body.name,
    country: req.body.country,
    state: req.body.state,
    phone: req.body.phone,
    email: req.body.email
  });
  try {
    const newShelter = await shelter.save();
    res.status(201).json(newShelter); // status 201 == successfully created object
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message }); // returns 400 which means bad user input (missing params)
  };
});

// Update
router.put('/:shelterId', async (req, res) => {
  try {
    const updatedShelter = await Shelter.findByIdAndUpdate(req.params.shelterId, req.body);
    if (!updatedShelter) {
      return res.status(404).json({
        'message': `Shelter with id ${req.params.shelterId} not found!`,
      });
    } 
    console.log(req.body);
    Object.values(req.body).forEach(param => {
      if (!param || param == "") {
        return res.status(500).json({
          "message": `Required parameter cannot be blank or null!`
        });
      };
    });
    return res.status(200).json({
      'message': `Updated shelter with id ${req.params.shelterId}`,
      'data': req.body
    });
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  };
});

// Delete
router.delete('/:shelterId', async (req, res) => {
  try {
    const deletedShelter = await Shelter.findByIdAndDelete(req.params.shelterId);
    if (!deletedShelter) {
      return res.status(404).json({
        'message': `Shelter with id ${req.params.shelterId} not found!`,
      });
    } 
    return res.status(200).json({
      'message': `Successfully deleted shelter with id ${req.params.shelterId}` 
    });
  } catch(err) {
    return res.status(500).json({ message: err.message });
  };
});

module.exports = router;