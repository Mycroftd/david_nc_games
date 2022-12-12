const app = require("../app.js");
const request = require("supertest");

const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("path not found", () => {
  test("passed an invalid path returns 404 msg", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

describe("/api/categories", () => {
  test("status 200, returns all categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories.length).toBe(4);
        body.categories.forEach((categories) => {
          expect(categories).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api/reviews", () =>{
    test("status 200, returns all reviews", () =>{
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({body}) =>{
            expect(body.reviews.length).toBe(13);
            body.reviews.forEach((reviews) => {
                expect(reviews).toMatchObject({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at:expect.any(String),
                    votes: expect.any(Number),
                });
              });
        })
    })
})