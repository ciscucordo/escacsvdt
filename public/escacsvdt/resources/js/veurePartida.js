
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

window.numJugadaActual = 0;
window.colorActual = "";
window.posCol = null;
window.listJugadesB = new Array();
window.listJugadesN = new Array();
window.listAllPosicioTauler = new Array(); 
window.listAllJugadesGraella = new Array();

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
    
    window.listAllPosicioTauler = doSelectPosicioTaulerByIdPartida(idPartida);
    window.listAllJugadesGraella = doSelectJugadesGraellaByIdGraella(jsonPartida[0].IDGRAELLA);
    
    for (var i = 0; i < window.listAllJugadesGraella.length; i++) {
        var reg = window.listAllJugadesGraella[i];
        apuntarJugada(jsonPartida[0].IDGRAELLA, reg.COLOR, reg.JUGADA);
    }
    
    initializeTaulerInVeurePartida(COLOR_BLANC);
    
}

function goToPosicioTauler(numJugada, color) 
{
    for (var i=0; i<window.listAllPosicioTauler.length; i++) {
        var jugada = window.listAllPosicioTauler[i];
        if (jugada.NUMJUGADA == numJugada && jugada.COLORULTIMAJUGADA == color) {
            paintFitxesFromPosicioTauler(jugada.POSICIO);
        }
    }
    window.numJugadaActual = numJugada;
    window.colorActual = color;
    
    $(".anotacioJugada").removeClass("selectedJugada").addClass("unselectedJugada");
    $("#numJugada"+window.colorActual+window.numJugadaActual).addClass("selectedJugada");
    //$("#numJugada"+window.colorActual+window.numJugadaActual).focus();
    //$("#divListJugades").scrollTop($("#tableListJugades").outerHeight());
    
    var xY = getPosition(document.getElementById("numJugada"+window.colorActual+window.numJugadaActual));
    console.log(xY);
    
    $("#divListJugades").scrollTop(xY.y-50);
    
    
}

function clickFirstJugada() {
    initializeTaulerInVeurePartida(COLOR_BLANC);
    window.numJugadaActual = 0;
    window.colorActual = "";
    goToPosicioTauler(window.numJugadaActual, window.colorActual);
}

function clickPriorJugada() {
    if (window.colorActual === COLOR_BLANC) {
        +window.numJugadaActual--;
    }
    if (window.numJugadaActual <= 0 && (window.colorActual === COLOR_BLANC || window.colorActual === "")) {
        clickFirstJugada();
        return;
    }
    window.colorActual = window.colorActual === COLOR_BLANC ? COLOR_NEGRE : COLOR_BLANC;
    goToPosicioTauler(window.numJugadaActual, window.colorActual);
}

function clickNextJugada() {
    if (+window.numJugadaActual+1 >= window.listAllPosicioTauler.length) {
        clickLastJugada();
    }
    if (window.numJugadaActual === 0 || window.colorActual === COLOR_NEGRE) {
        +window.numJugadaActual++;
    }
    window.colorActual = window.colorActual === COLOR_BLANC ? COLOR_NEGRE : COLOR_BLANC;
    goToPosicioTauler(window.numJugadaActual, window.colorActual);   
}

function clickLastJugada() {
    var jugada = window.listAllPosicioTauler[window.listAllPosicioTauler.length-1];
    window.numJugadaActual = jugada.NUMJUGADA;
    window.colorActual = jugada.COLORULTIMAJUGADA;
    goToPosicioTauler(window.numJugadaActual, window.colorActual);   
}

function paintFitxesFromPosicioTauler(posicio) {
    var arrayPosicio = posicio.split(',');
    var idxArrayPosicio = 0;
    for (var j = 0; j < NUM_FILES; j++) {
        for (var i = 0; i < NUM_COLUMNES; i++) {
            var objFitxa = document.getElementById(arrayTauler[i][j]);
            if (objFitxa) {
                objFitxa.style.display = "none";
            }
            arrayTauler[i][j] = arrayPosicio[idxArrayPosicio];
            idxArrayPosicio++;
        }
    }
    for (var j = 0; j < NUM_FILES; j++) {
        for (var i = 0; i < NUM_COLUMNES; i++) {
            var objFitxa = document.getElementById(arrayTauler[i][j]);
            if (objFitxa) {
                //document.getElementById(arrayTauler[i][j]).style.display = "block";
                setPosicioElDOM(objFitxa, obtenirPointCasellaDeIiJ(i, j, COLOR_BLANC));
            }
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

function doSelectJugadesGraellaByIdGraella(pIdGraella)
{
    var res = "";
    $.ajax({
        type: "post",
        url: "/doSelect-jugadesgraella",
        datatype: "json",
        data: "IDGRAELLA=" + pIdGraella,
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

function apuntarJugada(pIdGraella, pColor, pJugada) {
    var jugada;
    switch (pColor) {
        case "B":
            jugada = new Jugada(pIdGraella, window.listJugadesB.length + 1, pColor, pJugada);
            window.listJugadesB.push(jugada);
            var numJugada = window.listJugadesB.length;
            $("#tableListJugades").append(
                    "<tr>" +
                    "  <td id='numJugada" + numJugada + "' class='fontformgreater1' style='border:1px solid rgb(225, 125, 75);' onclick='javascript: goToPosicioTauler(\"" + numJugada + "\",\""+COLOR_BLANC+"\");'>" + numJugada + "</td>" +
                    "  <td id='numJugadaB" + numJugada + "' style='border:1px solid rgb(225, 125, 75);' onclick='javascript: goToPosicioTauler(\"" + numJugada + "\",\""+COLOR_BLANC+"\");' class='anotacioJugada'>" + pJugada + "</td>" +
                    "  <td id='numJugadaN" + numJugada + "' style='border:1px solid rgb(225, 125, 75);' onclick='javascript: goToPosicioTauler(\"" + numJugada + "\",\""+COLOR_NEGRE+"\");' class='anotacioJugada'></td>" +
                    "</tr>"
                    );
            break;
        case "N":
            jugada = new Jugada(pIdGraella, window.listJugadesN.length + 1, pColor, pJugada);
            window.listJugadesN.push(jugada);
            $("#numJugadaN" + window.listJugadesN.length).html(pJugada);
            break;
    }
    return jugada;
}

function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
  
    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
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