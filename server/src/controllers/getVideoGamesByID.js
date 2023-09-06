const axios = require("axios");
require("dotenv").config();
const { API_KEY, URL_BASE } = process.env;
const { Videogame, Genre } = require("../db");
const { Op } = require("sequelize");

const getVideogamesByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      const gameByIdDb = await Videogame.findOne({
        where: {
          id,
        },
        attributes: [
          "id",
          "name",
          "image",
          "description",
          "platforms",
          "date",

          "rating",
        ],
        include: [
          {
            model: Genre,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        ],
      });

      if (gameByIdDb) {
        return res.status(200).json(gameByIdDb);
      } else {
        return res.status(404).json({
          error: `No se encontró ningún personaje con el ID: ${id} en la base de datos.`,
        });
      }
    } else {
      let { data } = await axios(`${URL_BASE}/${id}?key=${API_KEY}`);

      let response = {
        id: data.id,
        name: data.name,
        image: data.background_image,
        description: data.description,
        platforms: data.parent_platforms.map((plat) => plat.platform.name),
        date: data.released,
        rating: data.rating,
        genres: data.genres.map((genre) => genre.name),
      };

      if (response) {
        return res.status(200).json(response);
      } else {
        return res.status(404).json({
          error: `No se encontró ningún personaje con el ID: ${id} en la API externa.`,
        });
      }
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
module.exports = getVideogamesByID;
