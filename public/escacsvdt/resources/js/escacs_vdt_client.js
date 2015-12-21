
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
    this.socket.emit("messagy", message);
};

EscacsVdtClient.prototype.sendCanBeginGame = function () {
    this.socket.emit("canBeginGame", {
        canBeginGame: true
    });
};

EscacsVdtClient.prototype.sendFinishGame = function (pRoom, pNickLoser, pColorLoser, pTipusFinish) {
    var finishGame = {
        room: pRoom,
        nickLoser: pNickLoser,
        colorLoser: pColorLoser,
        tipusFinish: pTipusFinish
    };
    this.socket.emit("finishGame", finishGame);
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


EscacsVdtClient.prototype.sendMove = function (pFitxaNom, pI, pJ, pColor, pTemps) {
    var doMove = {
        fitxaNom: pFitxaNom,
        i: pI,
        j: pJ,
        color: pColor,
        temps: pTemps
    };
    this.socket.emit("move", doMove);
};

EscacsVdtClient.prototype.changeRoom = function (pRoom, pElMeuNick) {
    this.socket.emit("join", {
        newRoom: pRoom,
        nick: pElMeuNick
    });
};



/*EscacsVdtClient.prototype.sendDisconnect = function() {
 this.socket.emit("disconnect");
 this.socket.removeAllListeners();
 };*/

EscacsVdtClient.prototype.processCommand = function (pCommand) {
    
    var _this = this;
    var xhr = getXHRSession();
    $.when($.ajax(xhr)).then(
        //function primer param --> ajax success!!!
        function (pSessionData, textStatus, jqXHR) 
        {
            try {
                var jsonSession = pSessionData;
                var elMeuNick = jsonSession[0].user;//NICKJUGADOR;
                var words = pCommand.split(" ");
                //obtenim l'ordre de la primera paraula
                var command = words[0];
                //eliminem el primer item (comanda)
                words.shift();
                var msgCommand = false;
                switch (command) {
                    /*case "nick":
                     _this.sendNick(words[1]);
                     break;*/
                    case "message":
                        var message = $("#send-message").val();
                        $("#divListMsg").append("<br /><b>Jo: </b>" + message);
                        $("#divListMsg").scrollTop($("#divListMsg").prop("scrollHeight"));
                        $("#send-message").val("");
                        _this.sendMessage(roomRepte, message);
                        break;
                    case "join":
                        //var room = words.join(" ");
                        //handle de la creació/canvi de l'habitació
                        _this.changeRoom(words[0], elMeuNick);
                        break;
                    case "doMove":
                        var fitxaNom = words[0];
                        var i = words[1];
                        var j = words[2];
                        var color = words[3];
                        var temps = words[4];
                        _this.sendMove(fitxaNom, i, j, color, temps);
                        window.colorTorn = window.colorTorn == "B" ? "N" : "B";
                        break;
                    case "proposeDraw":
                        $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);'>" + displayTime() + " - Has proposat taules a " + nickContrincant + ".</div>");
                        _this.sendProposeDraw(nickContrincant);
                        break;
                    case "replyProposeDraw":
                        var reply = words[0];
                        var replyMsg = (reply === "1" ? "Sí" : "No");
                        $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);'>" + displayTime() + " - A la proposta de taules de " + nickContrincant + " li has dit que " + replyMsg + "." + (reply == "1" ? " Per tant, la partida acaba en taules." : "") + "</div>");
                        if (reply === "1") {
                            $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);font-weight:bold'>" + displayTime() + " - RESULTAT: EMPAT (1/2-1/2)</div>");
                        }
                        _this.sendReplyProposeDraw(elMeuNick, reply);
                        break;
                    case "canBeginGame":
                        _this.sendCanBeginGame();
                        break;
                    case "finishGame":
                        var nickLoser, colorLoser, tipusFinish;
                        colorLoser = words[0];
                        var tipusFinish = words[1];
                        if (colorLoser === jsonSession[0].ELMEUCOLOR) {
                            nickLoser = elMeuNick;
                        } else {
                            nickLoser = nickContrincant;
                        }
                        _this.sendFinishGame(roomRepte, nickLoser, colorLoser, tipusFinish);
                        break;
                        /*case "disconnect":
                         _this.sendDisconnect();
                         break;*/
                    default:
                        msgCommand = "No es reconeix l'ordre.";
                        break;
                }
                if (msgCommand) {
                    $("#divListMsg").append(msgCommand);
                }
            } catch (e) {
                doIfSessionFailure(e);
            }
        }, 
        //function segon param --> ajax failure!!!
        function (data, textStatus, jqXHR) 
        {
            doIfSessionFailure(textStatus);
        }
    );
};

/*function processUserInput(pCommand, pEscacsVdt, pSocket) {
    var systemMessage;
    systemMessage = pEscacsVdt.processCommand(pCommand);
    if (systemMessage) {
        $("#divListMsg").append(systemMessage);
    }
}*/

//var socket = io.connect('http://localhost:3000');
//var socket = io.connect();
var socket;
var escacsVdtClient;

var /*jsonSession, */jsonJugadorContrincant;
var roomRepte = "roomRepte";
var elMeuNick = "";
var nickContrincant = "";
var canBeginGame = false;


$(document).ready(
    function () 
    {
        var xhr = getXHRSession();
        $.when($.ajax(xhr)).then(
            //function primer param --> ajax success!!!
            function (pSessionData, textStatus, jqXHR) 
            {
                try {
                    doOnReadyEscacs_vdt_client(pSessionData);
                } catch (e) {
                    doIfSessionFailure(e);
                }
            }, 
            //function segon param --> ajax failure!!!
            function (data, textStatus, jqXHR) 
            {
                doIfSessionFailure(textStatus);
            }
        );
    }
);

function doOnReadyEscacs_vdt_client(pSessionData) 
{
    var jsonSession = pSessionData;
    /*if (!jsonSession) {
     jsonSession = doGetSession();
     }*/

    elMeuNick = jsonSession[0].user; //NICKJUGADOR;

    jsonJugadorContrincant = doSelectJugadorById(jsonSession[0].IDJUGADORCONTRINCANT);
    nickContrincant = jsonJugadorContrincant[0].NICK;
    
    param_temps = jsonSession[0].TEMPS;
    param_tempsIncrement = jsonSession[0].TEMPSINCREMENT;
    param_ambEvaluacioElo = jsonSession[0].AMBEVALUACIOELO;


    //NOMÉS per a LOCAL
    /*
     var socket = io.connect();
     */

    var objSocketConnection = {
        'reconnect': true,
        'connect timeout': 30000,
        'reconnection delay': 300,
        'max reconnection attempts': 10000,
        'transports': ['websocket']
    };

    //per a LOCALHOST
    /*
    var socket = io('ws://192.168.1.3:3002',
        objSocketConnection
    );
    */

    //NOMÉS per a OPENSHIFT -->https://coderwall.com/p/pgk00a/socket-io-and-openshift-websockets
    var socket = io('ws://escacsvdt-6qdomain.rhcloud.com:8000',
        objSocketConnection
    );


    /*
     escacsVdtClient = new EscacsVdtClient(socket);
     */

    //mostra el canvi d'habitació
    /*socket.on("joinResult", function(pResult) {
     $("#room").text(pResult.room);
     $("#divListMsg").append("Canvi d'habitació.");
     });*/

    // Cuando la conexión es exitosa le preguntamos al user
    // su nick mediante un prompt y lo emitimos al servidor
    socket.on("connect", function () {

        escacsVdtClient = new EscacsVdtClient(socket);

        //entrem al repte actual!!!
        roomRepte = "repte" + jsonSession[0].IDREPTE;

        //console.log("escacs_vdt_client-->socket on connect:", roomRepte);
        //console.log("escacs_vdt_client-->NICKCONTRINCANT:", nickContrincant);

        escacsVdtClient.processCommand("join" + " " + roomRepte + " " + elMeuNick);
    })
            //si falla la connexió en local, provem a OPENSHIFT
            .on("connect_error", function () {
                /*socket = io('ws://escacsvdt-6qdomain.rhcloud.com:8000', 
                 objSocketConnection
                 );*/
            })
            //mostra missatges del sistema
            .on("systemMessage", function (pMessage) {
                $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 0);'>" + displayTime() + " - " + pMessage.text + "</div>");
            })
            //mostra missatge que ha entrat a la sala
            .on("systemMessageJoinRoom", function (pMessage) {
                if (pMessage.text === elMeuNick) {
                    $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 130, 0);'>" + displayTime() + " - Benvingut a la sala de joc.</div>");
                    $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 130, 0);'>" + displayTime() + " - Esperem que el contrincant entri a la sala</div>");
                }
            })
            .on("systemMessageBroadcastJoinRoom", function (pMessage) {
                if (pMessage.textAlreadyInRoom != "") {
                    var namesInRoom = pMessage.textAlreadyInRoom.split(",");
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
                    if (bEll === true) {
                        $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);'>" + displayTime() + " - Que comenci la partida!</div>");
                    }
                    if (bJo === true && bEll === true) {
                        canBeginGame = true;
                        escacsVdtClient.processCommand("canBeginGame");
                    }
                }
            })
            //pot començar la partida si el rival ja ha entrat a la sala
            .on("canBeginGame", function () {
                canBeginGame = true;
                $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);'>" + displayTime() + " - Que comenci la partida!</div>");
            })
            //mostra el missatge quan hi ha una desconnexió
            .on("systemMessageDisconnection", function (pMessage) {
                $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(180, 0, 0);'>" + displayTime() + " - " + pMessage.text + " ha sortit de la sala de joc.</div>");
                if (checkIfGameFinished() === true) {
                    return;
                }
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
            })

            /*socket.on("systemMessageBroadcastMyRoom", function (pMessage) {
             $("#divListMsg").append("<br /><b style='color:#FF0000'>" + pMessage.text + "</b>");
             });*/

            //mostra els missatges rebuts del jugador contrari
            .on("messagy", function (pMessage) {
                $("#divListMsg").append("<br /><b>" + pMessage.nick + "</b>: " + pMessage.text);
            })
            //mostra els moviments rebuts
            .on("move", function (pMove) {
                var fitxaNom = pMove.fitxaNom;
                var i = parseInt(pMove.i);
                var j = parseInt(pMove.j);
                var iiJ = new ElMeuPoint(i, j);
                doIsOKMove(fitxaNom, iiJ, 'rebrejugada', pMove.temps);
                window.colorTorn = window.colorTorn == "B" ? "N" : "B";
            })
            //mostra el missatge que proposició de taules
            .on("proposeDraw", function (pProposeDraw) {
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
            })
            .on("replyProposeDraw", function (pReplyProposeDraw) {
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
            })
            //finalització de la partida (resign, time, disconnect o checkmate)
            .on("finishGame", function (pFinishGame) {
                var tipusFinish = pFinishGame.tipusFinish;
                switch (pFinishGame.tipusFinish) {
                    case "resign":
                        tipusFinish = " per abandó.";
                        break;
                    case "time":
                        tipusFinish = " per temps.";
                        break;
                    case "disconnect":
                        tipusFinish = " perquè ha marxat de la sala.";
                        break;
                    case "checkmate":
                        tipusFinish = " per escac i mat.";
                        break;
                }
                var resultatMsg = '';
                var resultatBBDD = '-1';
                var colorWinner = pFinishGame.colorLoser === COLOR_BLANC ? COLOR_NEGRE : COLOR_BLANC;
                var nickWinner = pFinishGame.nickLoser === elMeuNick ? nickContrincant : elMeuNick;
                if (colorWinner === COLOR_BLANC) {
                    resultatMsg = 'GUANYEN BLANQUES (<b>' + nickWinner + '</b>)' + tipusFinish;
                    resultatBBDD = '1';
                } else if (colorWinner === COLOR_NEGRE) {
                    resultatMsg = 'GUANYEN NEGRES (<b>' + nickWinner + '</b>)' + tipusFinish;
                    resultatBBDD = '3';
                }
                $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);font-weight:bold'>" + displayTime() + " - " + resultatMsg + "</div>");
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
        escacsVdtClient.processCommand("message");
        //processUserInput("message", escacsVdtClient, socket);
        return false;
    });
}

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

function doIfCheckMate(pColorEnCheckMate) {
    
    var xhr = getXHRSession();
    $.when($.ajax(xhr)).then(
        //function primer param --> ajax success!!!
        function (pSessionData, textStatus, jqXHR) 
        {
            try {
                var jsonSession = pSessionData;
                var colorGuanyador = pColorEnCheckMate === "B" ? "N" : "B";
                var nickGuanyador;
                if (jsonSession[0].ELMEUCOLOR == colorGuanyador) {
                    nickGuanyador = elMeuNick;
                } else {
                    nickGuanyador = nickContrincant;
                }

                var resultatColor = '';
                var resultatMsg = '';
                var resultatBBDD = '-1';
                if (colorGuanyador == COLOR_BLANC) {
                    resultatColor = 'GUANYEN BLANQUES (1-0)';
                    resultatMsg = 'Les blanques (<b>' + nickGuanyador + '</b>) guanyen.';
                    resultatBBDD = '1';
                } else if (colorGuanyador == COLOR_NEGRE) {
                    resultatColor = 'GUANYEN NEGRES (0-1)';
                    resultatMsg = 'Les negres (<b>' + nickGuanyador + '</b>) guanyen.';
                    resultatBBDD = '3';
                }
                $("#divListMsg").append("<div style='width:100%;position:relative;color:rgb(0, 0, 255);font-weight:bold'>" + displayTime() + " - RESULTAT: " + resultatColor + "</div>");
                showInformationDialog("Informació", "<p class='formfontgreater1' style='text-align:center'>" + resultatMsg + "</p>");
                doUpdateResultatPartida(resultatBBDD);
            } catch (e) {
                doIfSessionFailure(e);
            }
        }, 
        //function segon param --> ajax failure!!!
        function (data, textStatus, jqXHR) 
        {
            doIfSessionFailure(textStatus);
        }
    );
    
}