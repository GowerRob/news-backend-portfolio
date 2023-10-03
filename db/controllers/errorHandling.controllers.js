exports.handlePSQLErrors=(err,req,res,next)=>{
    //An invalid request
    if(err.code==="22P02"){
      res.status(400).send({msg:'Bad request'})
    }
    next(err);
  }


  exports.handleCustomErrors=(err,req,res,next)=>{
    if(err.status){
        res.status(err.status).send({msg: err.msg});
    }else{
        next(err)   
    }
}

exports.handle500Errors=(err,req,res,next)=>{
    res.status(500).send({msg:"internal server error"});
}