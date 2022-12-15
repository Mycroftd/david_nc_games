const db = require("../db/connection");

exports.selectAllCategories = () => {
  return db.query("SELECT * FROM categories;").then((categories) => {
    return categories.rows;
  });
};

exports.selectReviewById = (reviewId) => {
  return (
    db
      //.query(`SELECT * FROM reviews WHERE  review_id = $1`, [reviewId])
      .query(
        `SELECT reviews.*,
    (SELECT CAST(COUNT(*) as INTEGER) AS comment_count FROM comments 
    WHERE reviews.review_id =  comments.review_id)
    FROM reviews WHERE reviews.review_id = $1`,
        [reviewId]
      )
      .then((review) => {
        if (review.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "review does not exist",
          });
        } else {
          return review.rows[0];
        }
      })
  );
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

exports.insertComment = (username, body, reviewId) => {
  return db
    .query(
      `
    INSERT INTO comments (body,review_id,author,votes,created_at)
    VALUES ($1,$2,$3,0,current_timestamp) RETURNING *;
  `,
      [body, reviewId, username]
    )
    .then((review) => {
      return review.rows[0];
    });
};

exports.selectUserNameById = (userName) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [userName])
    .then((user) => {
      if (user.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "review does not exist",
        });
      } else return true;
    });
};

exports.selectreviewComment = (reviewId) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1
                ORDER BY created_at ASC`,
      [reviewId]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.updateReviewsById = (inc_votes, reviewId) => {
  return db
    .query(
      `
    UPDATE reviews SET votes = votes + $1  WHERE review_id = $2
    RETURNING *;
  `,
      [inc_votes, reviewId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "review doesn't exist",
        });
      } else {
        return rows[0];
      }
    });
};

exports.selectAllUsers = () => {
  return db.query("SELECT * FROM users;").then((users) => {
    return users.rows;
  });
};

exports.removeComment = (commentId) =>{
  return db.query("DELETE FROM comments WHERE comment_id = $1",[commentId])
  .then(results =>{
    if(results.rowCount === 0){
      return Promise.reject({
        status: 404,
        msg: "comment doesn't exist",
      });
    }
    return;
  })
}