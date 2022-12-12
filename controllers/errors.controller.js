

exports.catch404Error = (req,res,next) =>{    
    res.status(404).send({msg: 'path not found'});
}

exports.catch500Error = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "internal server error" });
  }