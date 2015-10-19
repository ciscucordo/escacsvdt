
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
var param_idRepte;

var isOKMove = false;


window.openedDialogProposeDraw = null;


function PosicioColor(pPosB, pPosN)
{
    this.posB = pPosB;
    this.posN = pPosN;
}

function Jugada(pNJugada, pJugada)
{
    this.nJugada = pNJugada;
    this.jugada = pJugada;
}

window.posCol = null;
window.timer = null;
window.listJugadesB = new Array();
window.listJugadesN = new Array();

var jsonSession;

$(document).ready(function ()
{
    $("#capcaleraPag").html(htmlCapcaleraPag());
    
    jsonSession = doGetSession();
    
    param_idRepte = jsonSession[0].IDREPTE;
    var jsonPartida = doSelectIdPartidaByIdRepte(param_idRepte);
    if (jsonPartida.length > 0) {
        param_idPartida = jsonPartida[0].ID;
    } else {
        param_idPartida = doCrearPartida();
    }
    
    //controlem si hi ha hagut dessincronització per obtenir idPartida!!!
    if (!param_idPartida) {
        window.refreshGetIdPartida = self.setInterval(function () {
            console.log("No s'ha obtingut param_idPartida, s'intenta recuperar...");
            jsonPartida = doSelectIdPartidaByIdRepte(param_idRepte);
            if (jsonPartida.length > 0) {
                param_idPartida = jsonPartida[0].ID;
            }
            if (param_idPartida) {
                clearInterval(window.refreshGetIdPartida);
            }
        }, 1000);
    }
    
    var jsonJugadorContrincant = doSelectJugadorById(jsonSession[0].IDJUGADORCONTRINCANT);
    var nickJugadorContrincant = jsonJugadorContrincant[0].NICK;
    $("#labelJugadorTop").html(nickJugadorContrincant);
    $("#labelTempsTop").html(secondsToHms(jsonSession[0].TEMPS));
    $("#hiddenTempsTop").val(jsonSession[0].TEMPS);
    $("#labelJugadorBottom").html(jsonSession[0].NICKJUGADOR);
    $("#labelTempsBottom").html(secondsToHms(jsonSession[0].TEMPS));
    $("#hiddenTempsBottom").val(jsonSession[0].TEMPS);
    if (jsonSession[0].ELMEUCOLOR == "B") {
        window.posCol = new PosicioColor("bottom", "top");
    } else {
        window.posCol = new PosicioColor("top", "bottom");
    }
    
    window.refreshCanBeginGame = self.setInterval(function () {
        if (canBeginGame === true) {
            startTimer("B");
            clearInterval(window.refreshCanBeginGame);
        }
    }, 1000);
    
    /*$("#cocoloco").html
     (
     "idJugador: " + jsonSession[0].idJugador +
     "<br>nickJugador: " + jsonSession[0].nickJugador +
     "<br>idRepte: " + jsonSession[0].idRepte +
     "<br>tipusJugador: " + jsonSession[0].tipusJugador +
     "<br>elMeuColor: " + jsonSession[0].elMeuColor +
     "<br>temps: " + jsonSession[0].temps +
     "<br>tempsIncrement: " + jsonSession[0].tempsIncrement +
     "<br>idJugadorContrincant: " + jsonSession[0].idJugadorContrincant
     );*/

    //el primer torn sempre és de les BLANQUES ("B") !!!
    window.colorTorn = "B";
    param_colorUsuari = jsonSession[0].ELMEUCOLOR;
    
    console.log("param_idRepte:", param_idRepte, " param_idPartida:", param_idPartida);

});

function doSortir()
{
    //processUserInput("disconnect", escacsVdtClient, socket);
    window.location = "./llistes.htm";
}

function doCrearPartida()
{
    var jsonSession = doGetSession();
    var idJugador = jsonSession[0].IDJUGADOR;
    var idJugadorContrincant = jsonSession[0].IDJUGADORCONTRINCANT; 
    var idRepte = jsonSession[0].IDREPTE;
    var elMeuColor = jsonSession[0].ELMEUCOLOR;
    var idJugadorBlanques, idJugadorNegres;
    switch (elMeuColor) {
        case "B":
            idJugadorBlanques = idJugador;
            idJugadorNegres = idJugadorContrincant;
            break;
        case "N":
            idJugadorBlanques = idJugadorContrincant;
            idJugadorNegres = idJugador;
            break;
    }
    var temps = jsonSession[0].TEMPS;
    var tempsIncrement = jsonSession[0].TEMPSINCREMENT;
    var ambEvaluacioElo = jsonSession[0].AMBEVALUACIOELO;
    
    var idPartida = "";
    $.ajax({
        type: "post",
        url: "/doCrearPartida",
        datatype: "json",
        data: "IDREPTE=" + idRepte +
                "&IDJUGADORBLANQUES=" + idJugadorBlanques +
                "&IDJUGADORNEGRES=" + idJugadorNegres +
                "&TEMPS=" + temps +
                "&TEMPSINCREMENT=" + tempsIncrement +
                "&AMBEVALUACIOELO=" + ambEvaluacioElo,
        async: false,
        cache: false,
        timeout: 3000,
        success: function (data, textStatus, jqXHR) {
            var jsonPartida = doSelectIdPartidaByIdRepte(idRepte);
            if (jsonPartida.length > 0) {
                idPartida = jsonPartida[0].ID;
            } 
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        complete: function (jqXHR, textStatus) {
            //
        }
    });
    return idPartida;
}

function doAbandonar()
{
    var fnYes = function () {
        $.ajax({
            type: "post",
            url: "/doEliminarRepte",
            datatype: "text",
            data: "REPTELLISTAT_ID=" + param_idRepte,
            async: false,
            cache: false,
            timeout: 3000,
            success: function (data, textStatus, jqXHR) {
                doOmplirLlistaRepte();
                sOk = "1";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                sOk = "0";
            },
            complete: function (jqXHR, textStatus) {
                //
            }
        });
    };
    var fnNo = function () {
        //
    };
    showConfirmationDialog("Confirmació", "Vols realment abandonar? Encara hi ha partida home... ;)", fnYes, fnNo);
}

function doProposarTaules()
{
    processUserInput("proposeDraw", escacsVdtClient, socket);
    
    if (window.openedDialogProposeDraw) {
        window.openedDialogProposeDraw.dialog("close");
    }
    window.openedDialogProposeDraw = showInformationDialog("Informació", "<p class='formfontgreater1' style='text-align:center'>Proposta de taules enviada, esperant que contesti el contrincant...</p>");
}

function doProposarAplacar()
{
    showInformationDialog("Informació", "<p class='formfontgreater1' style='text-align:center'>Proposta d'aplaçar la partida enviada, esperant que contesti el contrincant...</p>");
}


function doSelectIdPartidaByIdRepte(pIdRepte)
{
    var res = "";
    $.ajax({
        type: "post",
        url: "/doSelect-partida",
        datatype: "json",
        data: "IDREPTE=" + pIdRepte,
        async: false,
        cache: false,
        timeout: 3000,
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
        cache: false,
        timeout: 3000,
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


function startTimer(pColor, pApretarRellotge) {
    var totalSeg = 0;
    var pos = pColor == "B" ? window.posCol.posB : window.posCol.posN;
    var colContrari = pColor == "B" ? "N" : "B";
    switch (pos) {
        case "top":
            totalSeg = $("#hiddenTempsTop").val();
            totalSeg--;
            $("#hiddenTempsTop").val(totalSeg);
            $("#labelTempsTop").html(secondsToHms(totalSeg));
            break;
        case "bottom":
            totalSeg = $("#hiddenTempsBottom").val();
            totalSeg--;
            $("#hiddenTempsBottom").val(totalSeg);
            $("#labelTempsBottom").html(secondsToHms(totalSeg));
            break;
    }
    var col = pColor;
    if (pApretarRellotge) {
        stopTimer();
        col = colContrari;
    }
    if (totalSeg > 0) {
        window.timer = setTimeout(function () {
            startTimer(col)
        }, 1000);
    }
}

function stopTimer() {
    if (window.timer) {
        clearTimeout(window.timer);
        window.timer = null;
    }
}

function apuntarJugada(pColor, pJugada) {
    switch (pColor) {
        case "B":
            var jugada = new Jugada(window.listJugadesB.length + 1, pJugada);
            window.listJugadesB.push(jugada);
            var nJugada = window.listJugadesB.length;
            $("#tableListJugades").append(
                    "<tr>" +
                    "  <td id='nJugada" + nJugada + "' class='fontformgreater1' style='border:1px solid rgb(225, 125, 75);'>" + nJugada + "</td>" +
                    "  <td id='nJugadaB" + nJugada + "' style='border:1px solid rgb(225, 125, 75);'>" + pJugada + "</td>" +
                    "  <td id='nJugadaN" + nJugada + "' style='border:1px solid rgb(225, 125, 75);'></td>" +
                    "</tr>"
                    );
            break;
        case "N":
            var jugada = new Jugada(window.listJugadesN.length + 1, pJugada);
            window.listJugadesN.push(jugada);
            $("#nJugadaN" + window.listJugadesN.length).html(pJugada);
            break;
    }
    return jugada;
}





// target elements with the "draggable" class
interact('.draggable').draggable({
    // enable inertial throwing
    inertia: false,
    // keep the element within the area of it's parent
    restrict: {
        restriction: "parent",
        endOnly: true//,
                //elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // call this function on every onstart event
    //onstart: dragStartListener,
    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: dragEndListener

});


interact('.draggable')
        .on('down', function (event) {
            mouseDownListener(event);
            //event.preventDefault();
        })
        .on('move', function (event) {
            mouseMoveListener(event);
            //event.preventDefault();
        })
        /*.on('tap', function (event) {
         initialListener(event);
         //event.preventDefault();
         })
         .on('hold', function (event) {
         initialListener(event);
         //event.preventDefault();
         })
         .on('start', function (event) {
         initialListener(event);
         //event.preventDefault();
         })*/;

function mouseDownListener(event) {
    var recMovOri = document.getElementById("recMovOri");
    var recMovDes = document.getElementById("recMovDes");

    recMovOri.style.display = "block";
    recMovDes.style.display = "none";

    var target = event.target;
    var iX = target.offsetLeft,
            iY = target.offsetTop;

    recMovOri.style.left = iX;
    recMovOri.style.top = iY;
    recMovDes.style.left = iX;
    recMovDes.style.top = iY;

    /*var arrayT = commutatorArrayT(TAULER_VIRTUAL);
     console.log("arrayT[4][6]:",arrayT[4][6]);
     var arrayE = commutatorArrayE(TAULER_VIRTUAL);
     console.log("arrayE[4][6]:",arrayE[4][6]);*/

    event.preventDefault();
}

function mouseMoveListener(event) {

    var target = event.target;

    var color = target.getAttribute("data-color");
    //var fD = getFitxaDadesFromElDOM(TAULER_REAL, target);
    if (canBeginGame === true && color === param_colorUsuari) {
    //if (fD.color === param_colorUsuari) {
        target.style.cursor = "grab";
    } else {
        target.style.cursor = "not-allowed";
    }

    event.preventDefault();
}

function dragMoveListener(event) {

    if (canBeginGame === false) return;

    var target = event.target;
    target.style.cursor = "grabbing";

    var _colorTorn = window.colorTorn;
    var _param_colorUsuari = param_colorUsuari;

    var color = target.getAttribute("data-color");
    //var fD = getFitxaDadesFromElDOM(TAULER_REAL, target);
    if (color !== _colorTorn || color !== _param_colorUsuari) {
    //if (fD.color !== _colorTorn || fD.color !== _param_colorUsuari) {
        return;
    }

    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    updateDataCoords(target, x, y);

    var iX = target.offsetLeft, // (target.style.left+"").replace("px","")
            iY = target.offsetTop, //(target.style.top+"").replace("px","");
            leftImg = iX + +(target.getAttribute('data-x')),
            topImg = iY + +(target.getAttribute('data-y'));
    var num = (leftImg + 30) / 60;
    var iPartX = Math.floor(num);
    var iPartX = (iPartX * 60);
    num = (topImg + 30) / 60;
    var iPartY = Math.floor(num);
    iPartY = (iPartY * 60);

    var recMovOri = document.getElementById("recMovOri");
    var recMovDes = document.getElementById("recMovDes");

    if (recMovDes.style.left === "") {
        recMovDes.style.left = recMovOri.style.left;
    }
    if (recMovDes.style.top === "") {
        recMovDes.style.top = recMovOri.style.top;
    }


    var sXOri = recMovDes.style.left;//iPartX+"px";
    var sYOri = recMovDes.style.top;//iPartY+"px";
    var sXDes = iPartX + "px";
    var sYDes = iPartY + "px";
    if (sXOri !== sXDes || sYOri !== sYDes) {

        recMovDes.style.display = "block";

        recMovDes.style.left = sXDes;
        recMovDes.style.top = sYDes;

        //var fD = getFitxaDadesFromElDOM(TAULER_REAL, target);
        var xiY = new Point(iPartX, iPartY);

        isOKMove = checkIsOKMove(target.id, new Point(iPartX, iPartY));
        //isOKMove = checkIsOKMove(fD.nom, new Point(iPartX, iPartY));

        if (isOKMove === true) {
            recMovDes.style.borderColor = "#66FF66";
        } else {
            recMovDes.style.borderColor = "#FF0000";
        }

    }

    event.preventDefault();

}

function dragEndListener(event) {

    var target = event.target;
    target.style.cursor = "grab";

    iX = target.offsetLeft, // (target.style.left+"").replace("px","")
            iY = target.offsetTop, //(target.style.top+"").replace("px","");
            leftImg = target.style.left = iX + +(target.getAttribute('data-x')),
            topImg = target.style.top = iY + +(target.getAttribute('data-y'));
    var num = (leftImg + 30) / 60;
    var iPartX = Math.floor(num);
    var iPartX = (iPartX * 60);
    num = (topImg + 30) / 60;
    iPartY = Math.floor(num);
    iPartY = (iPartY * 60);

    var xiY = new Point(iPartX, iPartY);

    if (isOKMove === true) {
        target.style.left = iPartX;
        target.style.top = iPartY;
        updateDataCoords(target, 0, 0);
        //fD.iiJ = xiY;
        //setFitxaDadesToElDOM(fD.nom, fD);
        //setPosicioFitxa(TAULER_REAL, fD.nom, xiY, param_colorUsuari);
        //accions a fer si el moviment és correcte, com afegir a la llista de jugades,
        //enviar la jugada i el temps
        doIsOKMove(target, xiY, true);

        //reiniciem moviment OK
        isOKMove = false;

    } else {
        //setPosicioFitxa(TAULER_REAL, fD.nom, fD.iiJInArray, param_colorUsuari);
        target.style.left = iX;
        target.style.top = iY;
        //target.style.left = fD.casella.x;
        //target.style.top = fD.casella.y;
        updateDataCoords(target, 0, 0);

        doIsKOMove();

    }


    showArrayTauler();

    //ocultar el recMovOri
    var recMovOri = document.getElementById("recMovOri");
    recMovOri.style.display = "none";

    //ocultar el recMovDes
    var recMovDes = document.getElementById("recMovDes");
    recMovDes.style.display = "none";

    //nivell de capa com les altres peces (que no es col·loqui una a sobre de l'altra)
    target.style.zIndex = "1";

    event.preventDefault();

}

function updateDataCoords(target, x, y) {
    // translate the element
    target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';
    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    target.style.zIndex = "1000";
}

// this is used later in the resizing demo
//window.dragMoveListener = dragMoveListener;
