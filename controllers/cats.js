require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();
const Cat = require('../models/cat');
const Shelter = require('../models/shelter');

// Helper function to ping catfact API for a fact
const getCatFact = async (req, res) => {
  try {
    const response = await axios.get('https://catfact.ninja/fact');
    const fact = response.data.fact;
    return fact;
  } catch (error) {
    console.error(error);
  };
};

// Helper function to ping catapi API for images
const getCatImage = async (req, res) => {
  try {
    const response = await axios.get(`https://api.thecatapi.com/v1/images/search?api_key=${process.env.CAT_API_KEY}`);
    const image = response.data[0].url;
    return image;
  } catch (error) {
    console.log(error);
  };
};

const happinessScore = (score) => {
  console.log(`score: ${score}`)
  if (score < 5) {
    return "They could use some more attention...";
  } else if (score < 10) {
    return "They're warming up to you.";
  } else {
    return "They look so happy!"
  }
}

// Index
router.get('/', async (req, res) => {
  try {
    const cats = await Cat.find();
    res.status(200).json(cats);
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
    return res.status(500).json({ message: err.message});
  };
});

// Create
router.post('/', async (req, res) => {
  catFact = await getCatFact();
  image = await getCatImage();
  const cat = new Cat({
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
    description: req.body.description,
    pictureUrl: image,
    fact: catFact,
    shelter: req.body.shelter,
    favouriteThing: ["treats", "pets", "play"][Math.floor(Math.random()*3)],
  });
  try {
    if (cat.shelter) { // if a shelter is assigned, update the shelter's listing to house the new cat
      newCatShelter = await Shelter.findById(cat.shelter);
      newCatShelter.cats.unshift(cat);
      newCatShelter.save();
    } else { // if a no shelter is assigned, assign a random shelter and update that shelter's listing to house the new cat
      shelters = await Shelter.find({});
      index = Math.floor(Math.random() * shelters.length);
      cat.shelter = shelters[index]._id; // also update the cat to have the shelter listed
      newCatShelter = await Shelter.findById(shelters[index]._id);
      newCatShelter.cats.unshift(cat);
      newCatShelter.save();
    };
    const newCat = await cat.save();
    res.status(201).json(newCat); // status 201 == successfully created object
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message }); // returns 400 which means bad user input (missing params)
  };
});

// Update - use PATCH for Cat because we only want to update specific attributes
router.patch('/:catId', async (req, res) => {
  try {
    updatedCat = await Cat.findById(req.params.catId);
    Object.keys(req.body).forEach(param => {
      if (!["name", "breed", "age", "description"].includes(param)) {
        return res.status(401).json({ message: `'${param}' is not a valid parameter to change on a cat! 
          You can only change 'name', 'breed', 'age' or 'description.`});
      };
    });
    if (req.body.name) {
      updatedCat.name = req.body.name;
    };
    if (req.body.breed) {
      updatedCat.breed = req.body.breed;
    };
    if (req.body.age) {
      updatedCat.age = req.body.age;
    };
    if (req.body.description) {
      updatedCat.description = req.body.description;
    };
    await updatedCat.save();
    return res.status(200).json({ message: `Updated cat with id ${req.params.catId}`, updatedCat });
  } catch(err) {
    return res.status(500).json({ message: err.message });
  };
});

// Pet
router.put('/:catId/pet', async (req, res) => {
  try {
    const petCat = await Cat.findById(req.params.catId);
    console.log(`petCat ${petCat.name}, loveMeter: ${petCat.loveMeter}`)
    if (!petCat) {
      return res.status(404).json({
        'message': `Could not pet cat with id ${req.params.catId}...`
      });
    }
    if (petCat.favouriteThing === "pets") {
      petCat.loveMeter += 3;
      await petCat.save();
      return res.status(200).json({
        'message': `${petCat.name} really loves pets! They've gained 3 happiness points! ${happinessScore(petCat.loveMeter)}`  
      });
    } else {
      petCat.loveMeter += 1;
      await petCat.save();
      return res.status(200).json({
        'message': `${petCat.name} liked that. They've gained 1 happiness point. ${happinessScore(petCat.loveMeter)}`  
      });
    };
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  };
});

// Play
router.put('/:catId/play', async (req, res) => {
  try {
    const playCat = await Cat.findById(req.params.catId);
    console.log(`playCat ${playCat.name}, loveMeter: ${playCat.loveMeter}`)
    if (!playCat) {
      return res.status(404).json({
        'message': `Could not play with cat with id ${req.params.catId}...`
      });
    }
    if (playCat.favouriteThing === "play") {
      playCat.loveMeter += 3;
      await playCat.save();
      return res.status(200).json({
        'message': `${playCat.name} really loves playing! They've gained 3 happiness points! ${happinessScore(playCat.loveMeter)}`  
      });
    } else {
      playCat.loveMeter += 1;
      await playCat.save();
      return res.status(200).json({
        'message': `${playCat.name} liked that. They've gained 1 happiness point. ${happinessScore(playCat.loveMeter)}`  
      });
    };
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  };
});

// Treats
router.put('/:catId/treats', async (req, res) => {
  try {
    const fedCat = await Cat.findById(req.params.catId);
    if (!fedCat) {
      return res.status(404).json({
        'message': `Could not feed cat with id ${req.params.catId}...`
      });
    }
    if (fedCat.favouriteThing === "treats") {
      fedCat.loveMeter += 3;
      await fedCat.save();
      return res.status(200).json({
        'message': `${fedCat.name} really loves treats! They've gained 3 happiness points! ${happinessScore(fedCat.loveMeter)}`  
      });
    } else {
      fedCat.loveMeter += 1;
      await fedCat.save();
      return res.status(200).json({
        'message': `${fedCat.name} liked that. They've gained 1 happiness point. ${happinessScore(fedCat.loveMeter)}`  
      });
    };
  } catch(err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  };
});

// Delete
router.delete('/:catId', async (req, res) => {
  try {
    if (!deletedCat) {
      return res.status(404).json({
        'message': `Cat with id ${req.params.catId} not found!`,
      });
    }; 
    return res.status(200).json({
      'message': `Successfully deleted cat with id ${req.params.catId}` 
    });
  } catch(err) {
    return res.status(500).json({ message: err.message });
  };
});

module.exports = router;