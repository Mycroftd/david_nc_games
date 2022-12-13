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

describe("/api/reviews/:review_id", () => {
    test("status 200, returns the correct review", ()=>{
        return request(app)
        .get ("/api/reviews/4")
        .expect(200)
        .then(({body})=>{
          expect(body.review).toMatchObject({
            review_id: 4,
            title: 'Dolor reprehenderit',
            category: 'social deduction',
            designer: 'Gamey McGameface',
            owner: 'mallionaire',
            review_img_url: 'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            created_at: '2021-01-22T11:35:50.936Z',
            votes: 7,
            review_body: 'Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod'
          })
        })
    })
    test("status 400, if given a invalid review id", () =>{
      return request(app)
      .get ("/api/reviews/banana")
      .expect(400)
      .then(({body}) =>{
        expect(body.msg).toBe("bad request");
      })
    })
    test("status 404, if given a valid review id that doesn't exist", () =>{
      return request(app)
      .get ("/api/reviews/1000")
      .expect(404)
      .then(({body}) =>{
        expect(body.msg).toBe("review does not exist");
      })
    })
})
