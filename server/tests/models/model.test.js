const request = require("supertest");
const app = require("../../src/app");
const { sequelize } = require("sequelize");
const { Videogame } = require("../../src/models/Videogame");

describe("Testing del modelo Videogame", () => {
  beforeAll(async () => {
    // Conecta a la base de datos primero
    await sequelize.sync();
  });

  afterAll(async () => {
    // Cierra la conexión con la base de datos al terminar
    await sequelize.close();
  });

  beforeEach(async () => {
    // Agrega datos de prueba a la base de datos antes de cada prueba
    await Videogame.bulkCreate([
      {
        name: "Alejo Holmann",
        description: "Aficionado del gimnasio y el ajedres",
        platforms: "PC PS5",
        image: "https://imagenes.com/foto1.jpg",
        date: "2021-11-30",
        rating: "4.3",
        inDB: true,
      },
      {
        name: "Ivan el Terrible",
        description: "Antiguo rey aleman, famoso por su locura",
        platforms: "History FOX",
        image: "https://imagenes.com/foto2.jpg",
        date: "2023-02-02",
        rating: "2.9",
        inDB: true,
      },
      {
        name: "Atila",
        description: "Ex rey de los Hunos, temible Guerrero",
        platforms: "Hungria",
        image: "https://imagenes.com/foto3.jpg",
        date: "2022-05-25",
        rating: "4.9",
        inDB: true,
      },
    ]);
  });

  afterEach(async () => {
    // Elimina los datos de prueba de la base de datos después de cada prueba
    await Videogame.destroy({ where: {} });
  });

  test("Debería obtener todos los videogames", async () => {
    const response = await request(app).get("/api/videogames");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
  });

  test("Debería obtener un videogame por su ID", async () => {
    const videogame = await Videogame.findOne({
      where: { name: "Alejo Holmann" },
    });

    const response = await request(app).get(`/api/videogames/${videogame.id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Alejo Holmann");
  });

  // Agrega más pruebas según tus necesidades
});
