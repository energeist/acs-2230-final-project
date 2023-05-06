const express = require('express');
const axios = require('axios');
const router = express.Router();
const Cat = require('../models/cat');

// Helper function to ping catfact API
const getCatFact = async (res, req) => {
  try {
    const response = await axios.get('https://catfact.ninja/fact');
    const fact = response.data.fact;
    return fact;
  } catch (error) {
    console.error(error);
  };
};

// Index
router.get('/', async (req, res) => {
  try {
    const cats = await Cat.find();
    res.status(418).json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message }); // returns 500 which means there was a server error
  };
});

// Show
router.get('/:catId', async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.catId);
    return res.status(200).json(cat);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message})
  };
});

// Create
router.post('/', async (req, res) => {
  const height = 350 + Math.floor(Math.random() * 100); 
  catFact = await getCatFact();
  const cat = new Cat({
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
    description: req.body.description,
    pictureUrl: `http://placekitten.com/400/${height}`,
    fact: catFact,
  });
  try {
    const newCat = await cat.save();
    res.status(201).json(newCat); // status 201 == successfully created object
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message }); // returns 400 which means bad user input (missing params)
  };
});

// Update
router.put('/:catId', async (req, res) => {
  try {
    const updatedCat = await Cat.findByIdAndUpdate(req.params.catId, req.body);
    if (!updatedCat) {
      return res.status(404).json({
        'message': `Cat with id ${req.params.catId} not found!`,
      });
    } 
    console.log(req.body);
    Object.values(req.body).forEach(param => {
      if (!param || param == "") {
        return res.status(500).json({
          "message": `Required parameter cannot be blank or null!`
        })
      }
    })
    return res.status(200).json({
      'message': `Updated cat with id ${req.params.catId}`,
      'data': req.body
    });
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  };
});

// Delete
router.delete('/:catId', async (req, res) => {
  try {
    const deletedCat = await Cat.findByIdAndDelete(req.params.catId)
    console.log("deletedCat")
    console.log(deletedCat)
    if (!deletedCat) {
      return res.status(404).json({
        'message': `Cat with id ${req.params.catId} not found!`,
      });
    } 
    return res.status(200).json({
      'message': `Successfully deleted cat with id ${req.params.catId}` 
    });
  } catch(err) {
    return res.status(500).json({ message: err.message });
  };
});

module.exports = router;