const app = require("../../src/app");
const session = require("supertest");
const request = session(app);

const obj = {
  name: "Alejo Holmann",
  rating: "3.5",
  date: "2023-11-30",
  platforms: "Tv PS4",
  image: "https://www.image.jpg.com",
  genders: [
    {
      name: "Action",
    },
  ],
  description: "Alive person. Happy and proactive.",
};
describe("Routes Testing", () => {
  describe("GET /videogames/:id", () => {
    it("Respode con status: 200", async () => {
      await request.get("/videogames").expect(200);
    });

    it('Responde un objeto con las propiedades: "id", "name", "rating", "gender", "date", "platfotms" e "image"', async () => {
      const resp = await request.get("/videogames/5458");

      for (const prop in obj) {
        expect(resp.body).toHaveProperty(prop);
      }
    });

    it("Si hay un error responde con status: 404", async () => {
      const resp = await request.get("/videogames/9999jjjA");
      expect(resp.statusCode).toBe(404);
    });
  });

  describe("GET /genres", () => {
    it("Responde con un objeto con 19 generos", async () => {
      const resp = await request.get("/genres");
      expect(resp.body).toEqual(access);
    });
  });

  describe("POST /videogames", () => {
    it("Debe guardar el videojuego en la DB", async () => {
      const resp = await request.post("/videogames").send(obj);
      expect(resp.body).toContainEqual(obj);
    });
  });
});
