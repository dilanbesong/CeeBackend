import { Server } from "socket.io";
import { User } from '../model/schema.js'
import { connectedUsers } from "../Services/ConnectedUser.js";
import { log } from "console";

const { connectedClients } = connectedUsers

const getSocketIdByUserId = (userId) => {
  return connectedClients.find( client => {
     return client.sockedId
  })
}




  const Active = (httpServer, userId) => {
  const io = new Server(httpServer, { cors: { origin: "*", methods:['POST', 'GET'] } })

  io.on('connection', (socket) => {
     // console.log("User connected");
      if(getSocketIdByUserId(userId)) return
       connectedClients.push({ sockedId:socket.id, userId })

     socket.on("disconnect", (sockedId) => {
         const activeUsers = connectedClients.filter( client => {
            return client.sockedId !== sockedId
         } )
         connectedUsers.connectedClients = activeUsers
        // console.log("Disconnected");
     })
     
  })
  console.log('chat section ....');
 // console.log(connectedUsers.connectedClients);
  
}

export default Active
