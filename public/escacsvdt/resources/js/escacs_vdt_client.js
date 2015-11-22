
var EscacsVdtClient = function (pSocket) {
    this.socket = pSocket;
};

/*EscacsVdtClient.prototype.sendNick = function (pNick) {
 this.socket.emit("nick", {
 nick: pNick
 });
 };*/

EscacsVdtClient.prototype.sendMessage = function (pRoom, pText) {
    var message = {
        room: pRoom,
        text: pText
    };
    this.socket.emit("message", message);
};

EscacsVdtClient.prototype.sendProposeDraw = function (pNickContrincant) {
    var proposeDraw = {
        nickProposat: pNickContrincant
    };
    this.socket.emit("proposeDraw", proposeDraw);
};

EscacsVdtClient.prototype.sendReplyProposeDraw = function (pElMeuNick, pReply) {
    //yes:1, no:0
    var replyProposeDraw = {
        nickProposador: pElMeuNick,
        reply: pReply
    };
    this.socket.emit("replyProposeDraw", replyProposeDraw);
};

EscacsVdtClient.prototype.sendDoCheckMate = function (pNickGuanyador, pColorGuanyador) {
    var doCheckMate = {
        nickGuanyador: pNickGuanyador,
        colorGuanyador: pColorGuanyador
    };
    this.socket.emit("doCheckMate", doCheckMate);
};

EscacsVdtClient.prototype.sendMove = function (pFitxaNom, pI, pJ, pColor) {
    var move = {
        fitxaNom: pFitxaNom,
        i: pI,
        j: pJ,
        color: pColor
    };
    this.socket.emit("move", move);
};

EscacsVdtClient.prototype.changeRoom = function (pRoom, pElMeuNick) {
    this.socket.emit("join", {
        newRoom: pRoom,
        nick: pElMeuNick
    });
};

EscacsVdtClient.prototype.sendCanBeginGame = function () {
    this.socket.emit("canBeginGame", {
        canBeginGame: true
    });
};

/*EscacsVdtClient.prototype.sendDisconnect = function() {
 this.socket.emit("disconnect");
 this.socket.removeAllListeners();
 };*/

EscacsVdtClient.prototype.processCommand = function (pCommand) {
    var elMeuNick = jsonSession[0].user;//NICKJUGADOR;
    var words = pCommand.split(" ");
    //obtenim l'ordre de la primera paraula
    var command = words[0];
    //eliminem el primer item (comanda)
    words.shift();
    var msgCommand = false;

    //console.log("pCommand:", pCommand);

    switch (command) {
        /*case "nick":
         this.sendNick(words[1]);
         break;*/
        case "message":
            var message = $("#send-message").val();
            $("#divListMsg").append("<br /><b>Jo: </b>" + message);
            $("#divListMsg").scrollTop($("#divListMsg").prop("scrollHeight"));
            $("#send-message").val("");
            this.sendMessage(roomRepte, message);
            break;
        case "join":
            //var room = words.join(" ");
            //handle de la creació/canvi de l'habitació
            this.changeRoom(words[0], elMeuNick);
            break;
        case "move":
            var fitxaNom = words[0];
            var i = words[1];
            var j = words[2];
            var color = words[3];
            this.sendMove(fitxaNom, i, j, color);
            window.colorTorn = window.colorTorn == "B" ? "N" : "B";
            break;
        case "proposeDraw":
            $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);'>" + displayTime() + " - Has proposat taules a " + nickContrincant + ".</div>");
            this.sendProposeDraw(nickContrincant);
            break;
        case "replyProposeDraw":
            var reply = words[0];
            var replyMsg = (reply == "1" ? "Sí" : "No");
            $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);'>" + displayTime() + " - A la proposta de taules de " + nickContrincant + " li has dit que " + replyMsg + "." + (reply == "1" ? " Per tant, la partida acaba en taules." : "") + "</div>");
            $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);font-weight:bold'>" + displayTime() + " - RESULTAT: EMPAT (1/2-1/2)</div>");
            this.sendReplyProposeDraw(elMeuNick, reply);
            break;
        case "canBeginGame":
            this.sendCanBeginGame();
            break;
        case "doCheckMate":
            var nickGuanyador;
            var colorGuanyador = words[0];
            if (colorGuanyador === jsonSession[0].ELMEUCOLOR) {
                nickGuanyador = elMeuNick;
            } else {
                nickGuanyador = nickContrincant;
            }
            this.sendDoCheckMate(nickGuanyador, colorGuanyador);
            break;
        case "finishGame":
            break;
            /*case "disconnect":
             this.sendDisconnect();
             break;*/
        default:
            msgCommand = "No es reconeix l'ordre.";
            break;
    }
    return msgCommand;
};

function processUserInput(pCommand, pEscacsVdt, pSocket) {
    var systemMessage;
    systemMessage = pEscacsVdt.processCommand(pCommand);
    if (systemMessage) {
        $("#divListMsg").append(systemMessage);
    }
}

//var socket = io.connect('http://localhost:3000');
//var socket = io.connect();
var socket;
var escacsVdtClient;

var /*jsonSession, */jsonJugadorContrincant;
var roomRepte = "roomRepte";
var elMeuNick = "";
var nickContrincant = "";
var canBeginGame = false;


$(document).ready(function () {

    if (!jsonSession) {
        jsonSession = doGetSession();
    }
    
    elMeuNick = jsonSession[0].user; //NICKJUGADOR;
    
    //console.log("escacs_vdt_client-->jsonSession:", jsonSession);
    
    jsonJugadorContrincant = doSelectJugadorById(jsonSession[0].IDJUGADORCONTRINCANT);
    nickContrincant = jsonJugadorContrincant[0].NICK;


    //per OPENSHIFT -->https://coderwall.com/p/pgk00a/socket-io-and-openshift-websockets
    //var socket = io.connect('ws://escacsvdt-6qdomain.rhcloud.com:8000/');
    //var socket = io.connect();
    //var socket = io();
    var socket = io('http://escacsvdt-6qdomain.rhcloud.com:8000' || 'http://192.168.1.3:8000', {
        //path: '/socket.io-client',
        transports: ['websocket','polling']
    });

    escacsVdtClient = new EscacsVdtClient(socket);
    //mostra el canvi d'habitació
    /*socket.on("joinResult", function(pResult) {
     $("#room").text(pResult.room);
     $("#divListMsg").append("Canvi d'habitació.");
     });*/

    // Cuando la conexión es exitosa le preguntamos al user
    // su nick mediante un prompt y lo emitimos al servidor
    socket.on("connect", function () {
        //entrem al repte actual!!!
        roomRepte = "repte" + jsonSession[0].IDREPTE;
        
        //console.log("escacs_vdt_client-->socket on connect:", roomRepte);
        //console.log("escacs_vdt_client-->NICKCONTRINCANT:", nickContrincant);
        
        escacsVdtClient.processCommand("join" + " " + roomRepte + " " + elMeuNick);
    });
    //mostra missatges del sistema
    socket.on("systemMessage", function (pMessage) {
        $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 0);'>" + displayTime() + " - " + pMessage.text + "</div>");
    });
    socket.on("systemMessageJoinRoom", function (pMessage) {
        if (pMessage.text === elMeuNick) {
            $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 130, 0);'>" + displayTime() + " - Benvingut a la sala de joc.</div>");
        }
    });
    socket.on("systemMessageBroadcastJoinRoom", function (pMessage) {
        if (pMessage.textAlreadyInRoom != "") {
            var namesInRoom = pMessage.textAlreadyInRoom.split(",");
            
            //console.log("namesInRoom:", namesInRoom);
            
            var bJo = false;
            var bEll = false;
            for (var i = 0; i < namesInRoom.length; i++) {
                if (bEll === false) {
                    bEll = (namesInRoom[i] === nickContrincant);
                }
                if (bJo === false) {
                    bJo = (namesInRoom[i] === elMeuNick);
                }
            }
            
            //console.log("bJo:", bJo, " bEll:", bEll);
            
            if (bEll === true) {
                $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);'>" + displayTime() + " - Que comenci la partida!</div>");
            }
            if (bJo === true && bEll === true) {
                canBeginGame = true;
                escacsVdtClient.processCommand("canBeginGame");
            }
        }
    });
    socket.on("canBeginGame", function() {
        canBeginGame = true;
        $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);'>" + displayTime() + " - Que comenci la partida!</div>");
    });
    socket.on("systemMessageDisconnection", function (pMessage) {
        $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(180, 0, 0);'>" + displayTime() + " - " + pMessage.text + " ha sortit de la sala de joc.</div>");
        var resultat = '';
        var resultatMsg = '';
        var resultatBBDD = '-1';
        if (jsonSession[0].ELMEUCOLOR == 'B') {
            resultat = 'GUANYEN BLANQUES (1-0)';
            resultatMsg = 'La partida ha acabant guanyant blanques perquè ' + pMessage.text + ' ha abandonat la sala.';
            resultatBBDD = '1';
        } else {
            resultat = 'GUANYEN NEGRES (0-1)';
            resultatMsg = 'La partida ha acabant guanyant negres perquè ' + pMessage.text + ' ha abandonat la sala.';
            resultatBBDD = '3';
        }
        $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);font-weight:bold'>" + displayTime() + " - RESULTAT: " + resultat + "</div>");
        showInformationDialog("Informació", "<p class='formfontgreater1' style='text-align:center'>" + resultatMsg + "</p>");
        doUpdateResultatPartida(resultatBBDD);
    });
    /*socket.on("systemMessageBroadcastMyRoom", function (pMessage) {
     $("#divListMsg").append("<br /><b style='color:#FF0000'>" + pMessage.text + "</b>");
     });*/

    //mostra els missatges rebuts del jugador contrari
    socket.on("message", function (pMessage) {
        $("#divListMsg").append("<br /><b>" + pMessage.nick + "</b>: " + pMessage.text);
    });
    //mostra els moviments rebuts
    socket.on("move", function (pMove) {
        var fitxaNom = pMove.fitxaNom;
        var i = parseInt(pMove.i);
        var j = parseInt(pMove.j);
        var iiJ = new ElMeuPoint(i, j);
        doIsOKMove(fitxaNom, iiJ, 'rebrejugada');
        window.colorTorn = window.colorTorn == "B" ? "N" : "B";
    });
    socket.on("proposeDraw", function (pProposeDraw) {
        $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);'>" + displayTime() + " - En " + nickContrincant + " et proposa taules.</div>");
        //var elMeuNick = jsonSession[0].user; //NICKJUGADOR;
        if (pProposeDraw.nickProposat == elMeuNick) {
            var fnYes = function () {
                escacsVdtClient.processCommand("replyProposeDraw" + " " + "1");
            };
            var fnNo = function () {
                escacsVdtClient.processCommand("replyProposeDraw" + " " + "0");
            };
            showConfirmationDialog("Confirmació", "En " + pProposeDraw.nickProposador + " et proposa taules. Acceptes?", fnYes, fnNo);
        }
    });
    socket.on("replyProposeDraw", function (pReplyProposeDraw) {
        if (window.openedDialogProposeDraw) {
            window.openedDialogProposeDraw.dialog("close");
        }
        switch (pReplyProposeDraw.reply) {
            case "1":
                $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);'>" + displayTime() + " - A la proposta de taules que li has demanat a " + nickContrincant + " t'ha dit que 'Sí'. :-) Per tant, la partida acaba en taules.</div>");
                $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);font-weight:bold'>" + displayTime() + " - RESULTAT: 1/2-1/2</div>");
                showInformationDialog("Informació", "<p class='formfontgreater1' style='text-align:center'>La partida ha acabat en taules. :-)</p>");

                //2 = empat
                doUpdateResultatPartida("2");

                break;
            case "0":
                $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);'>" + displayTime() + " - A la proposta de taules que li has demanat a " + nickContrincant + " t'ha dit que 'No'. Uuupsss!!! :-(</div>");
                showInformationDialog("Informació", "<p class='formfontgreater1' style='text-align:center'>El contrincant no accepta les taules. Uuupsss!!! :-(</p>");
                break;
        }
    });

    socket.on("doCheckMate", function (pDoCheckMate) {
        
        alert("mate");
        
        var resultat = '';
        var resultatMsg = '';
        var resultatBBDD = '-1';
        if (pDoCheckMate.colorGuanyador == COLOR_BLANC) {
            resultat = 'GUANYEN BLANQUES (1-0)';
            resultatMsg = 'La partida ha acabant guanyant blanques (<b>' + pDoCheckMate.nickGuanyador + '</b>) per escac i mat.';
            resultatBBDD = '1';
        } else if (pDoCheckMate.colorGuanyador == COLOR_NEGRE) {
            resultat = 'GUANYEN NEGRES (0-1)';
            resultatMsg = 'La partida ha acabant guanyant negres (<b>' + pDoCheckMate.nickGuanyador + '</b>) per escac i mat.';
            resultatBBDD = '3';
        }
        $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);font-weight:bold'>" + displayTime() + " - RESULTAT: " + resultat + "</div>");
        showInformationDialog("Informació", "<p class='formfontgreater1' style='text-align:center'>" + resultatMsg + "</p>");
        doUpdateResultatPartida(resultatBBDD);
    });


    //mostra la llista d'habitacions disponibles
    /*socket.on("rooms", function(pRooms) {
     $("#room-list").empty();
     for (var room in pRooms) {
     room = room.substring(1, room.length);
     if (room !== "") {
     $("#room-list").append(room);
     }
     }
     $("#room-list").click(function() {
     escacsVdtClient.processCommand("join " + $(this).text());
     $("#send-message").focus();
     });
     });
     setInterval(function() {
     socket.emit("rooms");
     }, 1000);*/
    //$("#send-message").focus();
    $("#send-form").submit(function () {
        processUserInput("message", escacsVdtClient, socket);
        return false;
    });

});

function doUpdateResultatPartida(pResultat)
{

    //console.log("idPartida:", param_idPartida);

    $.ajax({
        type: "post",
        url: "/doUpdateResultatPartida",
        datatype: "json",
        data: "IDPARTIDA=" + param_idPartida +
                "&RESULTAT=" + pResultat,
        async: false,
        //cache: false,
        timeout: 30000,
        success: function (data, textStatus, jqXHR) {
            //
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        complete: function (jqXHR, textStatus) {
            //
        }
    });

}