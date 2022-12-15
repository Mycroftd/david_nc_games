const {
  selectAllCategories,
  selectReviewById,
  selectAllReviews,
  insertComment,
  selectUserNameById,
  selectreviewComment,
  getAllUsers,
  updateReviewsById,
  removeComment,
  getCategoryById,
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
  let { category, order, sort_by } = req.query;

  const orderGreenList = ["DESC", "ASC"];
  if (!order) {
    order = "DESC";
  } else if (!orderGreenList.includes(order)) {    
    res.status(400).send({ msg: "invalid order" });
    return;
  }

  const sortByGreenList = [
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "review_body",
    "review_img_url",
    "created_at",
    "votes",
  ];
  if(!sort_by ){
    sort_by = "created_at"
  }
  else if (!sortByGreenList.includes(sort_by)){
    res.status(400).send({ msg: "invalid sort by" });
    return;
  }
  const promiseMethods = [selectAllReviews(category, order, sort_by)];
  if (category) {
    promiseMethods.push(getCategoryById(category));
  }
  Promise.all(promiseMethods)
    .then(([reviews]) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

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

exports.getAllreviewComment = (req, res, next) => {
  const reviewId = req.params.review_id;
  Promise.all([selectreviewComment(reviewId), selectReviewById(reviewId)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewById = (req, res, next) => {
  const { inc_votes } = req.body;
  if (!inc_votes) {
    res.status(400).send({ msg: "bad request" });
  }
  const reviewId = req.params.review_id;
  updateReviewsById(inc_votes, reviewId)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllUsers = (req, res, next) => {
  selectAllUsers().then((users) => {
    res.status(200).send({ users });
  }).catch((err) => {
    next(err);
  });
};


exports.deleteComment  =(req,res,next) =>{
  const {comment_id} = req.params;
  removeComment(comment_id).then(() =>{
    res.status(204).send({});
  }).catch((err) => {
    next(err);
  });
  
}

  exports.selectAllUsers =(req,res,next) =>{
    getAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

