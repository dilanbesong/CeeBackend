
const hasCode = (req, res) => {
    if(req.session.hasCode){
     next()
     return
    }
   return res.send({msg:"Cannot hasn't been sent"})
}

export { hasCode }