exports.handlePSQLErrors=(err,req,res,next)=>{
    //An invalid request
    if(err.code==="22P02"||err.code==="23502"){
      res.status(400).send({msg:'Bad request'})
    }
    else if(err.code==="23503"){
        res.status(404).send({msg:'Bad request'})
    }else{
       next(err); 
    }
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