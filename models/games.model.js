const db = require("../db/connection");

exports.selectAllCategories = () => {
  return db.query("SELECT * FROM categories;").then((categories) => {
    return categories.rows;
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
      return  reviews.rows ;
    });
};
