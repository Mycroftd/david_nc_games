const app = require("../app.js");
const request = require("supertest");
const jestSorted = require("jest-sorted");

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

describe("POST /api/reviews/:review_id/comments", () => {
  test("status 201, when a valid review id and username is given", () => {
    return request(app)
      .post("/api/reviews/4/comments")
      .send({
        username: "mallionaire",
        body: "comment review",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 7,
          body: "comment review",
          review_id: 4,
          author: "mallionaire",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("status 201, when a valid review id and username is given but should ignore any extra properties", () => {
    return request(app)
      .post("/api/reviews/4/comments")
      .send({
        username: "mallionaire",
        body: "comment review",
        author: "Dave",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 7,
          body: "comment review",
          review_id: 4,
          author: "mallionaire",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("status 400 if body doesn't contain username or body", () => {
    return request(app)
      .post("/api/reviews/4/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("status 404 if username doesn't exist", () => {
    return request(app)
      .post("/api/reviews/4/comments")
      .send({
        username: "banana",
        body: "comment review",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review does not exist");
      });
  });
  test("status 400 if review id is invalid", () => {
    return request(app)
      .post("/api/reviews/20/comments")
      .send({
        username: "mallionaire",
        body: "comment review",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

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
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: expect.any(Number),
          });
        });
      });
  });
  test("status 400, if invalid review id", () => {
    return request(app)
      .get("/api/reviews/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("status 200, if valid review but no results", () => {
    return request(app)
      .get("/api/reviews/5/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("status 404, if a valid review but no comment", () => {
    return request(app)
      .get("/api/reviews/9000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review does not exist");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("status 200 updates the votes by the correct amount", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({
        inc_votes: 1,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          review_id: 4,
          title: "Dolor reprehenderit",
          category: "social deduction",
          designer: "Gamey McGameface",
          owner: "mallionaire",
          review_body:
            "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          created_at: expect.any(String),
          votes: 8,
        });
      });
  });
  test("status 404, if review_id valid but doesn't exist", () => {
    return request(app)
      .patch("/api/reviews/400")
      .send({
        inc_votes: 1,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review doesn't exist");
      });
  });
  test("status 400, if review_id is invalid", () => {
    return request(app)
      .patch("/api/reviews/banana")
      .send({
        inc_votes: 1,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("status 400, if no body given", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("status 200, if body has extra values", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({
        inc_votes: 1,
        banana: 3,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          review_id: 4,
          title: "Dolor reprehenderit",
          category: "social deduction",
          designer: "Gamey McGameface",
          owner: "mallionaire",
          review_body:
            "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          created_at: expect.any(String),
          votes: 8,
        });
      });
  });
});

describe("GET /api/users", () => {
  test("status 200, returns all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/reviews (queries)", () => {
  test("status 200, if given a category query only returns result with that category and order by date", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(1);
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(body.reviews[0]).toMatchObject({
          review_id: 2,
          title: "Jenga",
          category: "dexterity",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_body: "Fiddly fun for all the family",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: expect.any(String),
          votes: 5,
          comment_count: 3,
        });
      });
  });
  test("status 200, if given no category returns all results", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(13);
      });
  });
  test("status 404, if category doesn't exist", () => {
    return request(app)
      .get("/api/reviews?category=dexterity=banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("status 200, if category exists but not in review table", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(0);
      });
  });
  test("status 200, if an order ASC by query is given sorts the list", () => {
    return request(app)
      .get("/api/reviews?order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(13);
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("status 200, if a order DESC by query is given sorts the list", () => {
    return request(app)
      .get("/api/reviews?order=DESC")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(13);
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("status 400, if invalid order parameter given defaults to DESC", () => {
    return request(app)
      .get("/api/reviews?order=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid order");
      });
  });
  test("status 200, if given a sort_by value", () => {
    return request(app)
      .get("/api/reviews?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(13);
        expect(body.reviews).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("status 400,  invalid sort by ", () => {
    return request(app)
      .get("/api/reviews?sort_by=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid sort by");
      });
  });
  test("status 200, a complex query with all three present works", () => {
    return request(app)
      .get("/api/reviews?category=social deduction&order=ASC&sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(11);
        expect(body.reviews).toBeSortedBy("title", {
          descending: false,
        });
      });
  });

});
