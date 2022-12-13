const db = require("../db/connection");

exports.selectAllCategories = () => {
  return db.query("SELECT * FROM categories;").then((categories) => {
    return categories.rows;
  });
};

exports.selectReviewById = (reviewId) => {
  return db
    .query("SELECT * FROM reviews WHERE  review_id = $1", [reviewId])
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "review does not exist",
        });
      } else {
        return review.rows[0];
      }
    });
};

exports.selectAllReviews = () => {
  return db
    .query(
      `
  SELECT reviews.*,
  (SELECT CAST(COUNT(*) as INTEGER) AS comment_count FROM comments 
  WHERE reviews.review_id =  comments.review_id)
  FROM reviews ORDER BY created_at DESC;`
    )
    .then((reviews) => {
      return reviews.rows;
    });
};

exports.selectreviewComment = () =>{

}