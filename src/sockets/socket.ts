const { io } = require('../index');
import authController from '../controllers/auth.controller'
import chatController from '../controllers/chat.controller'

let sockets: any [] = [];
// Mensajes de Sockets
io.on('connection', (socket: any) => {

  socket.on('nuevoConectado', (user:any) =>{
    authController.setOnlineStatus(user.id, true);
    socket.username = user.username;
    socket._id = user.id;
    socket.join(user.id);
    console.log(user.username + " se ha conectado");
    let info = {
      "user": user.username,
      "estado": true 
    }
    chatController.getIdMyChats(user.id).then((data:any) =>{
      data.chats.forEach((chat:any) =>{
        socket.join(chat._id);
      })
      io.emit("actConectado", info);
      sockets.push(socket)
    });
  });

  socket.on('disconnect', function(){
    if (socket._id != undefined){
      let info = {
        "user": socket.username,
        "estado": false 
      }
      authController.setOnlineStatus(socket._id, false);
      io.emit('actConectado', info);
      console.log(socket.username + " se ha desconectado");
      socket._id = undefined;
      socket.username = undefined;
      //io.emit('usuarioDesconectado', {user: socket.username, event: 'left'});  
    }
  });

  socket.on('nuevaSala', (chatid : any) =>{
    socket.join(chatid);
    //chatId = chatid;
    console.log("Sala " + chatid + " creada");
  });
  /*socket.on('set-name', (name: any) => {
    socket.username = name;
    io.emit('users-changed', {user: name, event: 'joined'});    
  });*/
  
  /*socket.on('send-message', (message: any) => {
    socket.to(chatId).emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});    
  });*/
});

function getSocket(){
  return io;
}

function getVectorSockets(){
  return sockets;
}

module.exports.getSocket = getSocket;
module.exports.getVectorSockets = getVectorSockets;