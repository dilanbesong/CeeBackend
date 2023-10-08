const isAuth = ( req, res, next) => {
   if( req.session.isloggedIn){
      next()
      return
   } 
   return res.status(404).send({ errMessage:'Unauthorise' })

}

export { isAuth }