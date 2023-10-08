
const hasCode = (req, res, next) => {
    if(req.session.hasCode){
     next()
     return
    }
   return res.send({msg:"Code hasn't been sent"})
}

export { hasCode }