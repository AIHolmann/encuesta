const axios = require("axios");
require("dotenv").config();
const { API_KEY, URL_GENRE } = process.env;
const { Videogame, Genre } = require("../db");

const postVideoGames = async (req, res) => {
  try {
    const {
      name,
      description,
      platforms,
      image,
      date,
      rating,
      genres,
      inDB,
      stock,
    } = req.body;
    //  console.log(name, description, platforms, image, date, rating, genre, inDB);
    let videojuego = await Videogame.create({
      name,
      description,
      platforms,
      image,
      date,

      rating,
      inDB,
    });

    //  let genresDB = [];
    for (let i = 0; i < genres.length; i++) {
      let genreDb = await Genre.findAll({
        where: { name: genres[i] },
      });
      videojuego.addGenre(genreDb);
      //   genresDB.push(genreDb[0].name);
      //  console.log(genreDb);
    }
    //  console.log(genresDB);
    res
      .status(200)
      .json({ message: `Videojuego creado con éxito`, videogame: videojuego });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el videojuego" });
  }
};

module.exports = postVideoGames;
