const { Router } = require("express");
const getAllVideoGames = require("../controllers/getAllVideoGames");
const getVideogamesByName = require("../controllers/getVideoGamesByName");
const getVideogamesByID = require("../controllers/getVideoGamesByID");
const getGenre = require("../controllers/getGenres");
const postVideoGames = require("../controllers/postVideoGames");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

router.get("/", (req, res) => {
  res.send("Welcome to mi encuesta's api");
});

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get("/videogames", (req, res) => {
  //getAllVideoGames(req, res);
  const { name } = req.query;
  if (name) {
    getVideogamesByName(req, res);
  } else {
    getAllVideoGames(req, res);
  }
});

router.get("/videogames/:id", (req, res) => getVideogamesByID(req, res));

router.get("/genres", getGenre);

router.post("/videogames", postVideoGames);

module.exports = router;
