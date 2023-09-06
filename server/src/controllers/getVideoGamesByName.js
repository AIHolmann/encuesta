const axios = require("axios");
require("dotenv").config();
const { API_KEY, URL_BASE } = process.env;
// const URL_BASE = "https://api.rawg.io/api/games";
const { Videogame, Genre } = require("../db");
const { Op } = require("sequelize");

const getVideogamesByName = async (req, res, next) => {
  const { name } = req.query;

  try {
    let gameByNameDb = await Videogame.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      attributes: ["id", "name", "image", "inDB"],
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
    let gameByNameApi = await axios(
      `${URL_BASE}?key=${API_KEY}&search=${name}`
    );
    let response = [
      ...gameByNameDb,
      ...gameByNameApi.data.results.map((game) => {
        return {
          id: game.id,
          name: game.name,
          image: game.background_image,
          genres: game.genres.map((genre) => {
            return {
              name: genre.name,
            };
          }),
        };
      }),
    ].slice(0, 15);
    const noContent = `No hay coincidencias al name: '${name}'`;
    if (response.length) {
      return res.status(200).json(response);
    } else {
      return res.status(404).json(noContent);
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
module.exports = getVideogamesByName;
