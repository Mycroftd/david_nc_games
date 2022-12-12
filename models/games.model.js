const db = require("../db/connection");

exports.selectAllCategories = () => {
  return db.query("SELECT * FROM categories;").then((categories) => {
    return categories.rows;
  });
};

exports.selectAllReviews = () => {
  return db.query("SELECT * FROM reviews;").then((reviews) => {
    return reviews.rows;
  });
};
