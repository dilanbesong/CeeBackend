import { Payment, User } from "../model/schema.js";
import jwt from "jsonwebtoken";


const getReciepts = async (req, res) => {
      try {
            const myId = await jwt.verify(
              req.session.userToken,
              process.env.JWT_SECRETE
            ).user._id; 
            const {  DepartmentalFees } = await User.findById(myId)
            const FeeIDs = await Promise.all( DepartmentalFees.map( async (paymentId) => {
                  if( await Payment.find(paymentId) == null){
                     await User.updateOne(
                       { _id:myId },
                       { $pull: { DepartmentalFees: paymentId} }
                     );               
                  }
                  return paymentId
            }))
            const Reciepts = await Payment.find( {_id:{ $in:FeeIDs } } ) 
            return res.status(200).send({ DepartmentalFees:Reciepts })     
      } catch (error) {
         return res.send({msg:error.message})         
      }            
}
const makePayment = async (req, res ) => {
     try {
         const myId = await jwt.verify(
           req.session.userToken,
           process.env.JWT_SECRETE
         ).user._id;
         const { regNumber, refNumber, amount, level } = req.body
         const user = await User.findById(myId)
         const departMentalFee = 5700 
         if( parseFloat(amount) !== departMentalFee ) {
           return res.send({msg:`Amount must be equall to N${departMentalFee}`})      
         } 
         const newReceipt = new Payment(req.body)
         await newReceipt.save()
         await User.updateOne(
           { _id: myId },
           { $push: { DepartmentalFees: newReceipt._id } }
         ); 
        if( user.level == 500) return res.status(200).send({ msg: "Payment Successfull !" }); 
         user.level += 100
         await user.save()
         return res.status(200).send({msg:'Payment Successfull !'})      
     } catch (error) {
         return res.send({ msg: error.message })         
     }             
}
export { getReciepts, makePayment }