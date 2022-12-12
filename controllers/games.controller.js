const categories = require('../db/data/test-data/categories');
const {selectAllCategories} = require('../models/games.model');

exports.getAllCategories = (req,res,next) =>{
    selectAllCategories().then((categories) =>{
        res.status(200).send({categories});
    })
}