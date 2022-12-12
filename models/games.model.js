const db = require("../db/connection");

exports.selectAllCategories = () => {
  return db.query("SELECT * FROM categories;").then((categories) => {
    return categories.rows;
  });
};

exports.selectAllReviews = () => {
  return db.query("SELECT * FROM reviews ORDER BY created_at DESC;").then((reviews) => {
    return reviews.rows;
  });
};
