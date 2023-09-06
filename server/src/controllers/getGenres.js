const axios = require("axios");
require("dotenv").config();
const { API_KEY, URL_GENRE } = process.env;
const { Genre } = require("../db");

const getGenre = async (req, res) => {
  try {
    const { data } = await axios(`${URL_GENRE}?key=${API_KEY}`);

    const genres = data.results.map((genre) => genre.name);
    genres.forEach((e) => {
      Genre.findOrCreate({
        where: { name: e },
      });
    });
    const allGenres = await Genre.findAll();
    return res.status(200).json(allGenres);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

module.exports = getGenre;
