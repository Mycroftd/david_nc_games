const {
  selectAllCategories,
  selectAllReviews,
} = require("../models/games.model");

exports.getAllCategories = (req, res, next) => {
  selectAllCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getAllReviews = (req,res, next) => {
  selectAllReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};
