
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
    this.jugada = pJugada;
}

window.numJugadaActual = 1;
window.colorActual = COLOR_BLANC;
window.posCol = null;
window.listJugadesB = new Array();
window.listJugadesN = new Array();
window.listAllJugades = new Array(); 


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
   
    var idPartida = jsonSession[0].IDPARTIDA;
    var jsonPartida = doSelectPartidaById(idPartida);
    
    var idJugadorBlanques = jsonPartida[0].IDJUGADORBLANQUES;
    var jsonJugadorBlanques = doSelectJugadorById(idJugadorBlanques);
    
    var idJugadorNegres = jsonPartida[0].IDJUGADORNEGRES;
    var jsonJugadorNegres = doSelectJugadorById(idJugadorNegres);
    
    $("#labelJugadorTop").html(jsonJugadorNegres[0].NICK);
    $("#labelJugadorBottom").html(jsonJugadorBlanques[0].NICK);
    //if (jsonSession[0].ELMEUCOLOR == "B") {
        window.posCol = new PosicioColor("bottom", "top");
    //} else {
    //    window.posCol = new PosicioColor("top", "bottom");
    //}
    
    window.listAllJugades = doSelectPosicioTaulerByIdPartida(idPartida);
    
    initializeTaulerInVeurePartida(COLOR_BLANC);
    
}

function goToPosicioTauler(numJugada, color) 
{
    for (var i=0; i<window.listAllJugades.length; i++) {
        var jugada = window.listAllJugades[i];
        if (jugada.NUMJUGADA === numJugada && jugada.COLORULTIMAJUGADA === color) {
            paintFitxesFromPosicioTauler(jugada.POSICIO);
        }
    }
    window.numJugadaActual = numJugada;
    window.colorActual = color;
}

function next() {
    goToPosicioTauler(window.numJugadaActual, window.colorActual);
    if (window.colorActual === COLOR_NEGRE) {
        window.numJugadaActual++;
    }
    window.colorActual = window.colorActual === COLOR_BLANC ? COLOR_NEGRE : COLOR_BLANC;
}

function paintFitxesFromPosicioTauler(posicio) {
    var arrayPosicio = posicio.split(',');
    var idxArrayPosicio = 0;
    for (var j = 0; j < NUM_FILES; j++) {
        for (var i = 0; i < NUM_COLUMNES; i++) {
            var fitxaNom = arrayPosicio[idxArrayPosicio];
            if (!arrayTauler[i][j]) {
                arrayTauler[i][j] = "";
            }
            if (arrayTauler[i][j] !== fitxaNom) {
                var objFitxaBefore = document.getElementById(arrayTauler[i][j]);
                if (objFitxaBefore && fitxaNom !== "") {
                    objFitxaBefore.style.display = "none";
                }
                arrayTauler[i][j] = fitxaNom;
                var objFitxaAfter = document.getElementById(arrayTauler[i][j]);
                if (objFitxaAfter) {
                    var xiY = obtenirPointCasellaDeIiJ(i, j, COLOR_BLANC);
                    if (objFitxaAfter.style.left !== xiY.x + "px" || objFitxaAfter.style.top !== xiY.y + "px") {
                        setPosicioElDOM(fitxaNom, xiY);
                    }
                }
            }
            idxArrayPosicio++;
        }
    }
}

function doSortir()
{    
    doUpdateVeurePartidaSession({
        IDPARTIDA: null
    }, "./llistes.htm");
    //window.location = "./llistes.htm";
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

/*
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
*/