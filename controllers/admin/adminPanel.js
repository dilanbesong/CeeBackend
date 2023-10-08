import { Group, Payment, User } from "../../model/schema.js"
import jwt from 'jsonwebtoken'


const getAllAdmins = async (req, res) => {
   try {
      const admins = await User.find({ isAdmin:true })
      return res.status(200).send(admins)
   } catch (error) {
      return res.status(500).send({ msg: error.message });
   }
}

const blockAccount = async (req, res) => {
  try {
   
     const { userId } = req.body

     const user =  await User.findById(userId)
     if(user.isBlocked){
        user.isBlocked = false
        await user.save()
        return res.status(200).send({ msg: `${user.username} has been unblocked! `, showAlert:true, user })
     }
       user.isBlocked = true;
       await user.save();
       return res.status(200).send({ msg: `${user.username} has been blocked!`, showAlert:true, user });
  } catch (error) {
    return res.status(500).send({ err: error.message });
  }
}

const deleteOneUser = async (req, res) => {
   try {
      const { userId } = req.body
      await User.findByIdAndDelete(userId)
      const user = await User.findById(userId)
      if(user == null){
        return res.send( { userId, isDelete:true })
      }
      return res.status(200).send(users)
   } catch (error) {
      return res.status(500).send({ msg: error.message })
   }
}


const getStudents = async (req, res) => {
   try {
     const { YearOfEntry } = req.params

     async function getAllStudents(users, totalPayments){
      
           const BoysData = users.map((user) => {
              if(user.Sex == 'male'){
                 return parseInt(user.regNumber.substr(-4));
              }
  
           }).filter( regNumber => regNumber !== undefined);
           

           const GirlsData = users.map((user) => {
              if( user.Sex == 'female'){
                return parseInt(user.regNumber.substr(-4));
              }
  
           }).filter( regNumber => regNumber !== undefined)
           let NumberOfBoys = BoysData.length;
           let NumberOfGirls = GirlsData.length;
           let NumberOfStudents = NumberOfBoys + NumberOfGirls;

    
           return res
             .status(200)
             .send({ NumberOfBoys, NumberOfGirls, NumberOfStudents, totalPayments, users, GirlsData, BoysData });
     }
     
     if( YearOfEntry == 'all'){
         const users = await User.find({ isAdmin: { $ne: true } });
         const payments = await Payment.find()
         const totalPayments = await payments.reduce(( total, payment) => {
           let payTotal = total + parseInt(payment.amount);
           return payTotal
        }, 0)
        getAllStudents(users, totalPayments)
        return
     }
    
     const users = await User.find({ $and:[{ isAdmin: { $ne: true } }, { YearOfEntry: YearOfEntry}] } );
      const payments = await Payment.find({ Year:YearOfEntry})
      const totalPayments = await payments.reduce((total, payment) => {
        let payTotal = total + parseInt(payment.amount);
        return payTotal;
      }, 0);
    
      getAllStudents(users, totalPayments);

   } catch (error) {
      return res.status(500).send({ err: error.message });
   }
}


const getYearOptions = async(req, res) => {
   try {
        const users = await User.find({ isAdmin : { $ne: true}});
        const enteredYear = users.map(user => {
           return user.YearOfEntry
        })
        return res.status(200).send({ YearOfEntry:[ ...new Set(enteredYear), 'all' ] })
   } catch (error) {
     return res.status(500).send({ err: error.message });
   }
}

export {     
       getAllAdmins,
       deleteOneUser, 
       getStudents, 
       blockAccount,
       getYearOptions,
      }