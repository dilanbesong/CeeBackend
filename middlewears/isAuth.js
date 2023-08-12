const isAuth = ( req, res, next) => {
   if( req.session.isloggedIn){
      next()
      return
   } 
   return res.send('Unauthorise!!')

}

export { isAuth }