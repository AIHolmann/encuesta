const axios = require("axios");
require("dotenv").config();
const { API_KEY, URL_BASE } = process.env;
const { Videogame, Genre } = require("../db");

//mostrar solo id nombre imagen y genero en el compaginado principal

const getAllVideoGamesByAPI = async (req, res) => {
  try {
    let URL = ``;
    if (req) URL = `${URL_BASE}?key=${API_KEY}&page=${req}`;
    if (!req) URL = `${URL_BASE}?key=${API_KEY}`;

    const { data } = await axios.get(`${URL}`);

    if (!data) throw Error();
    const videoGameInfo = [];
    await Promise.all(
      data.results.map((game) => {
        let obj = {
          id: game.id,
          name: game.name,
          rating: game.rating,
          image: game.background_image,
          genres: game.genres.map((genre) => {
            return {
              name: genre.name,
            };
          }),
        };
        videoGameInfo.push(obj);
        //tengo 20 videogames
      })
    );
    return videoGameInfo;
  } catch (error) {
    return { error: error.message };
  }
};

const getAllVideoGamesByDB = async () => {
  try {
    const videoGamesDB = await Videogame.findAll({
      attributes: ["id", "name", "image", "inDB", "rating"],
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
    if (videoGamesDB.length) return videoGamesDB;
    if (videoGamesDB.length === 0) return 0;
    if (!videoGamesDB) throw Error();
  } catch (error) {
    throw Error();
  }
};

const getAllVideoGames = async (req, res) => {
  try {
    let apiInfo = [];
    let i = 1;
    for (let index = 0; index < 5; index++) {
      if (index === 0) {
        let data = await getAllVideoGamesByAPI();
        apiInfo.push(data);
        i++;
      }
      if (index !== 0) {
        let data = await getAllVideoGamesByAPI(i);
        apiInfo.push(data);
        i++;
      }
    }
    apiInfo = apiInfo.flat();
    const dbInfo = await getAllVideoGamesByDB();

    if (dbInfo === 0) return res.status(200).json(apiInfo);
    if (!dbInfo) throw Error();
    const allInfo = apiInfo.concat(dbInfo);
    return res.status(200).json(allInfo);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
module.exports = getAllVideoGames;
