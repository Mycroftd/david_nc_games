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
  test("status 200, returns the correct review", () => {
    return request(app)
      .get("/api/reviews/4")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          review_id: 4,
          title: "Dolor reprehenderit",
          category: "social deduction",
          designer: "Gamey McGameface",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          created_at: "2021-01-22T11:35:50.936Z",
          votes: 7,
          review_body:
            "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
        });
      });
  });
  test("status 400, if given a invalid review id", () => {
    return request(app)
      .get("/api/reviews/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("status 404, if given a valid review id that doesn't exist", () => {
    return request(app)
      .get("/api/reviews/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review does not exist");
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
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at:expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number)
                });
              });
        })
    })
})

describe("POST /api/reviews/:review_id/comments", () =>{
  test("status 201, when a valid review id and username is given", () =>{
    return request(app)
    .post("/api/reviews/4/comments")
    .send({
      username: "mallionaire",
      body: "comment review"
    })
    .expect(201)
    .then(({body}) =>{
      expect(body.comment).toMatchObject({
        comment_id: 7,
        body: 'comment review',
        review_id: 4,
        author: 'mallionaire',
        votes: 0,
        created_at: expect.any(String)
      })
    })
  })
  test("status 201, when a valid review id and username is given but should ignore any extra properties", () =>{
    return request(app)
    .post("/api/reviews/4/comments")
    .send({
      username: "mallionaire",
      body: "comment review",
      author: "Dave"
    })
    .expect(201)
    .then(({body}) =>{
      expect(body.comment).toMatchObject({
        comment_id: 7,
        body: 'comment review',
        review_id: 4,
        author: 'mallionaire',
        votes: 0,
        created_at: expect.any(String)
      })
    })
  })
  test("status 400 if body doesn't contain username or body", () =>{
    return request(app)
    .post("/api/reviews/4/comments")
    .send({

    })
    .expect(400)
    .then(({body}) =>{
      expect(body.msg).toBe("bad request");
    })
  })
  test("status 404 if username doesn't exist", () =>{
    return request(app)
    .post("/api/reviews/4/comments")
    .send({
      username: "banana",
      body: "comment review"
    })
    .expect(404)
    .then(({body}) =>{
      expect(body.msg).toBe("review does not exist");
    })
  })
  test("status 400 if review id is invalid", () =>{
    return request(app)
    .post("/api/reviews/20/comments")
    .send({
      username: "mallionaire",
      body: "comment review"
    })
    .expect(400)
    .then(({body}) =>{
      expect(body.msg).toBe("bad request");
    })
  })
})

describe("/api/reviews", () => {
  test("status 200, returns all reviews", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(13);
        body.reviews.forEach((reviews) => {
          expect(reviews).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  test("status 200, returns comments with certain review id", () => {
    return request(app)
    .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(3);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes : expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: expect.any(Number)
          });
        });
      });
  });
  test("status 400, if invalid review id" , () =>{
    return request(app)
    .get("/api/reviews/banana/comments")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("bad request")
    });
  })
  test("status 200, if valid review but no results", () =>{
    return request(app)
    .get("/api/reviews/5/comments")
    .expect(200)
    .then(({ body }) => {
      expect(body.comments).toEqual([])
    });
  });
  test("status 404, if a valid review but no comment", () =>{
    return request(app)
    .get("/api/reviews/9000/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("review does not exist");
    });
  })
});

