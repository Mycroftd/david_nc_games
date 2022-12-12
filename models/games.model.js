 const db = require('../db/connection');

 exports.selectAllCategories = () =>{
   return db.query('SELECT * FROM categories;').then((categories)=>{
        return categories.rows;
   })
 } 

 exports.selectReviewById = (reviewId) =>{
    return db.query('SELECT * FROM reviews WHERE  review_id = $1',[reviewId]).then((review) =>{
      if(review.rows.length === 0){
        return Promise.reject({
          status: 404,
          msg: "review does not exist",
        });
      }
      else{
        return review.rows[0];
      }

    })
 }  