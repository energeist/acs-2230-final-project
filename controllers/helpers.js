const axios = require('axios');

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

module.exports = { getCatFact, getCatImage }