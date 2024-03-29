const express = require("express");
const cors = require('cors');
const app = express();

const {
  getAllCategories,
  getReviewById,
  getAllReviews,
  getAllreviewComment,
  addComment,
  endPoints,
  selectAllUsers,
  patchReviewById,
  deleteComment
} = require("./controllers/games.controller");
const {
  catch404Error,
  catch500Error,
  databaseError,
  customError,
} = require("./controllers/errors.controller");

app.use(cors());
app.use(express.json());

app.get("/api/categories", getAllCategories);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getAllreviewComment);
app.post("/api/reviews/:review_id/comments", addComment);
app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/users", selectAllUsers);
app.delete("/api/comments/:comment_id",deleteComment)

app.get("/api", endPoints);


app.all("*", catch404Error);

app.use(databaseError);

app.use(customError);

app.use(catch500Error);

module.exports = app;
