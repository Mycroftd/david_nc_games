 const db = require('../db/connection');

 exports.selectAllCategories = () =>{
   return db.query('SELECT * FROM categories;').then((categories)=>{
        return categories.rows;
   })
 } 

 exports.selectReviewById = () =>{
    
 }