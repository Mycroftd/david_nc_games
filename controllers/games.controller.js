const {
  selectAllCategories,
  selectReviewById,
  selectAllReviews,
  insertComment,
  selectUserNameById,
} = require("../models/games.model");

exports.getAllCategories = (req, res, next) => {
  selectAllCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  selectReviewById(reviewId)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllReviews = (req, res, next) => {
  selectAllReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getAllreviewComment = (req, res, next) => {};

exports.addComment = (req, res, next) => {
  const { username, body } = req.body;
  const reviewId = req.params.review_id;
  if (!username || !body) res.status(400).send({ msg: "bad request" });

  selectUserNameById(username)
    .then(() => {
      return insertComment(username, body, reviewId);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
