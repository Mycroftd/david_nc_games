const {
  selectAllCategories,
  selectReviewById,
  selectAllReviews,
  selectreviewComment
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
  }

exports.getAllReviews = (req,res, next) => {
  selectAllReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
}

exports.getAllreviewComment = (req,res,next) =>{
  const reviewId = req.params.review_id;
  Promise.all([selectreviewComment(reviewId), selectReviewById(reviewId)])
  .then(([comments]) => { 
    res.status(200).send({comments});
  }).catch((err) =>{
    next(err);
  })
}
