
//var socketio = require("socket.io");
var io;
//var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var mainRoom = {};

//per OPENSHIFT -->https://coderwall.com/p/pgk00a/socket-io-and-openshift-websockets
exports.addSocketIOEvents = function (pIO) {
//exports.addSocketIOEvents = function (pServerHTTP) {

    //arranquem el servidor Socket.IO sobre el servidor HTTP
    io = pIO;
    //io = socketio.listen(pServerHTTP);

    //io.set('origins', 'http://localhost:80');
    //per fer DEBUG, escriure al cmd: "DEBUG=socket.io* node myapp"
    //io.set("log level", 1);

    //es defineix un handle de cada connexió d'usuari invitat
    io.sockets.on("connection", function (pSocket) {
        //assignem el nick
        //handleNickBroadcasting(pSocket);
        //creació/canvi de l'habitació
        handleRoomJoining(pSocket);
        //enviar/rebre jugades
        handleMoveBroadcasting(pSocket);
        //guestNumber = assignGuestName(pSocket, guestNumber, nickNames, namesUsed);
        //col·loquem a l'usuari invitat a una habitació 
        //joinRoom(pSocket);
        //handle dels missatges de l'usuari
        handleMessageBroadcasting(pSocket, nickNames);
        //dóna a l'usuari una llista d'usuaris de l'habitació
        pSocket.on("rooms", function () {
            //pSocket.emit("rooms", io.sockets.adapter.rooms);
            pSocket.emit("rooms", io.sockets.manager.rooms);
        });
        handleProposeDrawBroadcasting(pSocket);
        handleReplyProposeDrawBroadcasting(pSocket);
        //es neteja quan l'usuari es desconnecta
        handleClientDisconnection(pSocket, nickNames, namesUsed);
    });
};

/*function assignGuestName(pSocket, pGuestNumber, pNickNames, pNamesUsed) {
 //generem un nou nom d'usuari invitat
 var name = "Invitat" + pGuestNumber;
 //ASSOCIEM EL NOM D'USUARI AMB L'ID DE CONNEXIÓ DE L'USUARI
 pNickNames[pSocket.id] = name;
 //permet a l'usuari saber quin nom se li ha assignat com a invitat
 pSocket.emit("nameResult", {
 success: true,
 name: name
 });
 //afegim el nom assignat a la llista de noms
 pNamesUsed.push(name);
 //per al següent invitat incrementant el número
 return pGuestNumber + 1;
 }*/

function joinRoom(pSocket, pRoom) {

    //console.log("room:", pRoom, "namesUsed:", namesUsed);

    //col·loquem l'usuari dins l'habitació
    pSocket.join(pRoom.newRoom);
    //associem l'usuari invitat amb l'habitació en què està actualment
    mainRoom[pSocket.id] = pRoom.newRoom;
    var nick = nickNames[pSocket.id];
    var nicksAlreadyInRoom = "";
    for (var i = 0; i < namesUsed.length; i++) {
        if (namesUsed[i] && namesUsed[i] !== nick) {
            nicksAlreadyInRoom += namesUsed[i] + " ";
        }
    }
    pSocket.broadcast.to(pRoom.newRoom).emit("systemMessageJoinRoom", {
        text: nick.trim(),
        textAlreadyInRoom: nicksAlreadyInRoom.trim()
    });
    pSocket.emit("systemMessageJoinRoom", {
        text: nick.trim(),
        textAlreadyInRoom: nicksAlreadyInRoom.trim()
    });



    /*pSocket.emit("systemMessage", {
     nickContrincant: nick,
     text: nick + " ha entrat a la sala de joc."
     });*/
    //permet a l'usuari saber que està a dins de l'habitació
    //pSocket.emit("joinResult", {room: pRoom});
    //permet als altres usuaris saber que aquest usuari està dins d'aquesta habitació
    /*pSocket.broadcast.to(pRoom).emit("message", {
     text: nickNames[pSocket.id] + " s'ha afegit a " + pRoom + "."
     });
     //mirem quins altres usuaris hi ha a la mateixa habitació que l'usuari que s'acaba de connectar
     var usersInRoom = io.sockets.adapter.rooms[pRoom];   
     //to get the number of users
     var numUsersInRoom = (typeof usersInRoom !== 'undefined') ? Object.keys(usersInRoom).length : 0;
     if (numUsersInRoom > 1) {
     var usersInRoomSummary = "Usuaris actualment a " + pRoom + ": ";
     for (var index in usersInRoom) {
     //this is the socket of each client in the room.
     var userSocketId = io.sockets.connected[index];
     if (userSocketId != pSocket.id) {
     if (index > 0) {
     usersInRoomSummary += ", ";
     }
     usersInRoomSummary += nickNames[userSocketId];
     }
     //you can do whatever you need with this
     userSocketId.emit('new event', "Updates");
     }
     usersInRoomSummary += ".";
     //envia la llista d'usuaris que hi ha en aquesta habitació cap a l'usuari que s'acaba de connectar
     pSocket.emit("message", {text: usersInRoomSummary});
     }
     var usersInRoom = io.sockets.clients(pRoom);
     if (usersInRoom.length > 1) {
     var usersInRoomSummary = "Usuaris actualment a " + pRoom + ": ";
     for (var index in usersInRoom) {
     var userSocketId = usersInRoom[index].id;
     if (userSocketId != pSocket.id) {
     if (index > 0) {
     usersInRoomSummary += ", ";
     }
     usersInRoomSummary += nickNames[userSocketId];
     }
     }
     usersInRoomSummary += ".";
     //envia la llista d'usuaris que hi ha en aquesta habitació cap a l'usuari que s'acaba de connectar
     pSocket.emit("message", {text: usersInRoomSummary});
     }*/
}

function handleNickBroadcasting(pSocket) {
    pSocket.on("nick", function (pNick) {
        nickNames[pSocket.id] = pNick.nick;
        //afegim el nom assignat a la llista de noms
        namesUsed.push(pNick.nick);
    });
}

function handleMessageBroadcasting(pSocket) {
    pSocket.on("message", function (pMessage) {
        pSocket.broadcast.to(pMessage.room).emit("message", {
            nick: nickNames[pSocket.id],
            text: pMessage.text
        });
    });
}

function handleMoveBroadcasting(pSocket) {
    pSocket.on("move", function (pMove) {
        var room = mainRoom[pSocket.id];
        pSocket.broadcast.to(room).emit("move", {
            fitxaNom: pMove.fitxaNom,
            i: pMove.i,
            j: pMove.j,
            color: pMove.color
        });
    });
}

function handleRoomJoining(pSocket) {
    pSocket.on("join", function (pRoom) {
        pSocket.leave(mainRoom[pSocket.id]);

        nickNames[pSocket.id] = pRoom.nick;
        //afegim el nom assignat a la llista de noms
        namesUsed.push(pRoom.nick);

        joinRoom(pSocket, pRoom);
    });
}

/*function handleMyRoomBroadcasting(pSocket) {
 pSocket.on("broadcastMyRoom", function() {
 var room = mainRoom[pSocket.id];
 var nick = nickNames[pSocket.id];
 pSocket.broadcast.to(room).emit("systemMessageJoinRoom", {
 nickContrincant: nick,
 text: nick + " ja havia entrat a la sala de joc."
 });
 });
 }*/

function handleProposeDrawBroadcasting(pSocket) {
    pSocket.on("proposeDraw", function (pProposeDraw) {
        var room = mainRoom[pSocket.id];
        var nickProposador = nickNames[pSocket.id];
        //console.log("handleProposeDrawBroadcasting:", room, nickProposador, pProposeDraw.nickProposat);
        pSocket.broadcast.to(room).emit("proposeDraw", {
            nickProposador: nickProposador,
            nickProposat: pProposeDraw.nickProposat
        });
    });
}

function handleReplyProposeDrawBroadcasting(pSocket) {
    pSocket.on("replyProposeDraw", function (pReplyProposeDraw) {
        var room = mainRoom[pSocket.id];
        var nickProposat = nickNames[pSocket.id];
        //console.log("handleReplyProposeDrawBroadcasting:", room, nickProposat, pReplyProposeDraw.nickProposador);
        pSocket.broadcast.to(room).emit("replyProposeDraw", {
            nickProposat: nickProposat,
            reply: pReplyProposeDraw.reply
        });
    });
}

function handleClientDisconnection(pSocket) {
    pSocket.on("disconnect", function () {

        //console.log("disconnect:", nickNames[pSocket.id]);

        var nameIndex = namesUsed.indexOf(nickNames[pSocket.id]);
        var room = mainRoom[pSocket.id];
        pSocket.broadcast.to(room).emit("systemMessageDisconnection", {
            text: nickNames[pSocket.id]
        });
        //pSocket.emit("systemMessage", {text: nickNames[pSocket.id] + " ha sortit de la sala de joc."});
        namesUsed.splice(nameIndex, 1);
        //delete namesUsed[nameIndex];
        delete nickNames[pSocket.id];

    });
}