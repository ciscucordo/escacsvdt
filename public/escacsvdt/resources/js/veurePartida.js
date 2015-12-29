
localStorage.debug = '*';
var COLOR_BLANC = "B";
var COLOR_NEGRE = "N";
var TIPUS_FITXA_REI = "R";
var TIPUS_FITXA_DAMA = "D";
var TIPUS_FITXA_ALFIL = "A";
var TIPUS_FITXA_CAVALL = "C";
var TIPUS_FITXA_TORRE = "T";
var TIPUS_FITXA_PEO = "P";
//control del color que toca jugar
window.colorTorn = "";
//color del jugador el qual s'ha loginat !!!
var param_colorUsuari;
var param_idPartida;
var param_idGraella;


function PosicioColor(pPosB, pPosN)
{
    this.posB = pPosB;
    this.posN = pPosN;
}

function Jugada(pIdGraella, pNumJugada, pColor, pJugada)
{
    this.idGraella = pIdGraella; 
    this.numJugada = pNumJugada;
    this.color = pColor;
    this.jugada = "jol";
    //this.jugada = pJugada;
}

window.posCol = null;
window.listJugadesB = new Array();
window.listJugadesN = new Array();


$(document).ready(
    function () 
    {
        var xhr = getXHRSession();
        $.when($.ajax(xhr)).then(
            //function primer param --> ajax success!!!
            function (pSessionData, textStatus, jqXHR) 
            {
                try {
                    doOnReadyVeurePartida(pSessionData);
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


function doOnReadyVeurePartida(pSessionData) 
{
    
    
    
    
    
    var jsonSession = pSessionData;
    
    $("#capcaleraPag").html(htmlCapcaleraPag());
   
    param_idRepte = jsonSession[0].IDREPTE;
    var jsonPartida = doSelectIdPartidaByIdRepte(param_idRepte);
    if (jsonPartida.length > 0) {
        param_idPartida = jsonPartida[0].ID;
        param_idGraella = jsonPartida[0].IDGRAELLA;
    } else {
        param_idPartida = doCrearPartida(jsonSession);
        jsonPartida = doSelectPartidaById(param_idPartida);
        param_idGraella = jsonPartida[0].IDGRAELLA;
    }
    
    //controlem si hi ha hagut dessincronització per obtenir idPartida!!!
    if (!param_idPartida) {
        window.refreshGetIdPartida = self.setInterval(function () {
            //console.log("No s'ha obtingut param_idPartida, s'intenta recuperar...");
            jsonPartida = doSelectIdPartidaByIdRepte(param_idRepte);
            if (jsonPartida.length > 0) {
                param_idPartida = jsonPartida[0].ID;
                param_idGraella = jsonPartida[0].IDGRAELLA;
            }
            if (param_idPartida) {
                clearInterval(window.refreshGetIdPartida);
            }
        }, 1000);
    }
    
    var jsonJugadorContrincant = doSelectJugadorById(jsonSession[0].IDJUGADORCONTRINCANT);
    var nickJugadorContrincant = jsonJugadorContrincant[0].NICK;
    $("#labelJugadorTop").html(nickJugadorContrincant);
    $("#labelJugadorBottom").html(jsonSession[0].user);
    if (jsonSession[0].ELMEUCOLOR == "B") {
        window.posCol = new PosicioColor("bottom", "top");
    } else {
        window.posCol = new PosicioColor("top", "bottom");
    }
}




function doSortir()
{    
    var fnYes = function () {
        //processUserInput("finishGame" + " " + param_colorUsuari + " " + "disconnect", escacsVdtClient, socket);
        //processUserInput("disconnect", escacsVdtClient, socket);
        window.location = "./llistes.htm";
    };
    var fnNo = function () {
        //
    };
    
    if (checkIfGameFinished() === true) {
        window.location = "./llistes.htm";
    } else {
        showConfirmationDialog("Confirmació", "Vols realment abandonar?", fnYes, fnNo);
    }
}


function doSelectPartidaById(pIdPartida)
{
    var res = "";
    $.ajax({
        type: "post",
        url: "/doSelect-partida",
        datatype: "json",
        data: "ID=" + pIdPartida,
        async: false,
        //cache: false,
        timeout: 30000,
        success: function (data, textStatus, jqXHR) {
            res = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        complete: function (jqXHR, textStatus) {
            //
        }
    });
    return res;   
}

function doSelectJugadorById(pIdJugador)
{
    var res = "";
    $.ajax({
        type: "post",
        url: "/doSelect-jugador",
        datatype: "json",
        data: "ID=" + pIdJugador,
        async: false,
        //cache: false,
        timeout: 30000,
        success: function (data, textStatus, jqXHR) {
            res = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        complete: function (jqXHR, textStatus) {
            //
        }
    });
    return res;
}

function doSelectPosicioTaulerByIdPartida(pIdPartida)
{
    var res = "";
    $.ajax({
        type: "post",
        url: "/doSelect-posiciotauler",
        datatype: "json",
        data: "IDPARTIDA=" + pIdPartida,
        async: false,
        //cache: false,
        timeout: 30000,
        success: function (data, textStatus, jqXHR) {
            res = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        complete: function (jqXHR, textStatus) {
            //
        }
    });
    return res;   
}


function apuntarJugada(pColor, pJugada) {
    var jugada;
    switch (pColor) {
        case "B":
            jugada = new Jugada(param_idGraella, window.listJugadesB.length + 1, pColor, pJugada);
            window.listJugadesB.push(jugada);
            var numJugada = window.listJugadesB.length;
            $("#tableListJugades").append(
                    "<tr>" +
                    "  <td id='numJugada" + numJugada + "' class='fontformgreater1' style='border:1px solid rgb(225, 125, 75);'>" + numJugada + "</td>" +
                    "  <td id='numJugadaB" + numJugada + "' style='border:1px solid rgb(225, 125, 75);'>" + pJugada + "</td>" +
                    "  <td id='numJugadaN" + numJugada + "' style='border:1px solid rgb(225, 125, 75);'></td>" +
                    "</tr>"
                    );
            break;
        case "N":
            jugada = new Jugada(param_idGraella, window.listJugadesN.length + 1, pColor, pJugada);
            window.listJugadesN.push(jugada);
            $("#numJugadaN" + window.listJugadesN.length).html(pJugada);
            break;
    }
    return jugada;
}


var parseQueryString = function() {
    var str = window.location.search;
    var objURL = {};
    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    return objURL;
};

//Example how to use it: 
var params = parseQueryString();
alert(params["IDPARTIDA"]); 