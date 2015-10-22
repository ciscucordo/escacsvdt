
window.openedDialog = null;

$(document).ready(function () {

    $("#capcaleraPag").html(htmlCapcaleraPag());

    $("#form-filter-jugador").submit(function (e) {
        e.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            url: '/doFilterJugador',
            type: 'post',
            datatype: 'json',
            data: formData,
            async: true,
            //cache: false,
            timeout: 3000,
            success: function (data) {
                if (data.length >= 0) {
                    window.location = "./llistes.htm";
                } else {
                    $(".labError").text("Error en l'autenticació");
                    $("#tdError").css("background-color", "#BBAA00");
                }
                //recórrer per les files retornades
                /*
                 for (var i = 0; i < data.length; i++){
                 console.log(data[i]);
                 }
                 */
            },
            error: function (s, i, error) {
                //window.location = "./login.htm";
                console.log(error);
            }
        });
        return true;
    });

    doOmplirLlistaJugador();
    doOmplirLlistaRepte();

});



//////////////////////////////////// ini jugador ///////////////////////////////
function goToAnteriorPagJugador()
{
    document.getElementById("inputNumPagActualJugador").value = document.getElementById("inputNumPagAnteriorJugador").value;
    doOmplirLlistaJugador();
}

function goToSeguentPagJugador()
{
    document.getElementById("inputNumPagActualJugador").value = document.getElementById("inputNumPagSeguentJugador").value;
    doOmplirLlistaJugador();
}

function doOmplirLlistaJugadorSub(pValueNick, pValuePerfil_desc, pValueEstat, pValueNumPagActual)
{
    $.ajax({
        url: '/doListJugador',
        type: 'post',
        datatype: 'json',
        data: "JUGADORLLISTAT_NICK=" + pValueNick +
                "&JUGADORLLISTAT_PERFIL_DESC=" + pValuePerfil_desc +
                "&JUGADORLLISTAT_ESTAT_DESC=" + pValueEstat,
        async: true,
        //cache: false,
        timeout: 3000,
        success: function (data) {
            if (data.length >= 0) {
                var html = "<tr>" +
                        "<td width='10%' style='height: 0px;'>" +
                        "</td>" +
                        "<td width='50%'>" +
                        "<!-- // -->" +
                        "</td>" +
                        "<td width='10%'>" +
                        "<!-- // -->" +
                        "</td>" +
                        "<td width='30%'>" +
                        "<!-- // -->" +
                        "</td>" +
                        "</tr>";
                var regIniFin_ = new regIniFin(pValueNumPagActual, data.length);
                var iniReg = regIniFin_.reg_ini;
                var finReg = regIniFin_.reg_fin;
                var nRows = 0;
                for (var i = iniReg; i < finReg; i++) {
                    var reg = data[i];
                    
                    //console.log(reg);
                    
                    html += "<tr>" +
                            "<td class='formfont' style='text-align: center; height: 25px;'>" +
                            "<!-- // -->" +
                            "</td>" +
                            "<td class='formfont' style='text-align: left; padding-left: 5px'>" +
                            "<label>" + reg.JUGADORLLISTAT_NOM + " " + reg.JUGADORLLISTAT_COGNOMS + " (<b>" + reg.JUGADORLLISTAT_NICK + "</b>)</label>" +
                            "</td>" +
                            "<td class='formfont' style='text-align: center; padding-left: 5px'>";
                    switch (reg.JUGADORLLISTAT_ESTAT) {
                        case -1:
                            html += "<img src='../resources/img/statusDesconnectat.PNG' alt='desconnectat' title='desconnectat'>";
                            break;
                        case 0:
                            html += "<img src='../resources/img/statusLliure.PNG' alt='lliure' title='lliure'>";
                            break;
                        case 1:
                            html += "<img src='../resources/img/statusReptant.PNG' alt='reptant' title='reptant'>";
                            break;
                        case 2:
                            html += "<img src='../resources/img/statusJugant.PNG' alt='jugant' title='jugant'>";
                            break;
                    }
                    html += "</td>" +
                            "<td class='formfont' style='text-align: left; padding-left: 5px'>" +
                            "<label>" + reg.JUGADORLLISTAT_HORA_ULTIM_LOGIN + "</label>" +
                            "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td colspan='4' style='height: 5px; background-image: url(../resources/img/separadorFilasLista.PNG); background-repeat: repeat-x;'>" +
                            "</td>" +
                            "</tr>";
                    nRows++;
                }

                //afegim les files buides fins que arribem a màx. per pàg.
                for (var i = 1; i <= regIniFin_.max_reg_por_pag - nRows; i++) {
                    html += "<tr>" +
                            "<td colspan='4' class='formfont' style='text-align: center; height: 25px;'>" +
                            "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td colspan='4' style='height: 5px; background-image: url(../resources/img/separadorFilasLista.PNG); background-repeat: repeat-x;'>" +
                            "</td>" +
                            "</tr>";
                }

                $("#subTableJugador").html(html);
                $("#labelAlJugadorLlistatSize").html(data.length + " jugador(s)");
                $("#inputNumPagAnteriorJugador").val(regIniFin_.num_pag_anterior);
                $("#inputNumPagSeguentJugador").val(regIniFin_.num_pag_siguiente);
                $("#inputNumPagActualPagMaxJugador").val(regIniFin_.num_pag_actual + " de " + regIniFin_.num_pag_max);
            } else {
                $(".labError").text("No hi ha jugadors");
            }
        },
        error: function (s, i, error) {
            //window.location = "./login.htm";
            console.log(error);
        }
    });

    /*
     $("#table_jugador").load(
     pUrl, 
     {
     "JUGADORLLISTAT_NICK": pValueNick
     , "JUGADORLLISTAT_PERFIL_DESC": pValuePerfil_desc
     , "JUGADORLLISTAT_ESTAT_DESC": pValueEstat
     },
     function(response, status, xhr) {
     var json = JSON.stringify(response);
     if (status == "error") {
     //
     } else {
     return "pepe";
     }
     }
     );
     */

}

function doOmplirLlistaJugador()
{
    $.ajaxSetup({cache: false});
    clearIntervalLlista("PAG_LLISTA_JUGADOR");
    //filtres de la llista
    var objNick = document.getElementById("nick");
    var objEstat = document.getElementById("estat");
    var objNumPagActual = document.getElementById("inputNumPagActualJugador");
    var valueNick = objNick.value;
    var valuePerfil_desc = "";
    var valueEstat = objEstat.value;
    var valueNumPagActual = objNumPagActual.value;
    doOmplirLlistaJugadorSub(valueNick, valuePerfil_desc, valueEstat, valueNumPagActual);
    //actualitzem la llista cada 5 seg. (5000)
    window.refreshLlistaJugador = self.setInterval(function () {
        doOmplirLlistaJugadorSub(valueNick, valuePerfil_desc, valueEstat, valueNumPagActual);
    }, 5000);
}

//////////////////////////////////// fin jugador ///////////////////////////////



//////////////////////////////////// ini repte /////////////////////////////////
function doMirarRepteAcceptat()
{
    if (!jsonSession) {
        jsonSession = doGetSession();
    }
    
    var res = "";
    $.ajax({
        type: "post",
        url: "/doMirarRepteAcceptat",
        datatype: "json",
        data: "REPTELLISTAT_IDJUGADOR=" + jsonSession[0].IDJUGADOR,
        async: true,
        //cache: false,
        timeout: 3000,
        success: function (data, textStatus, jqXHR) {
            var jsonMirarRepteAcceptat = data;
            if (jsonMirarRepteAcceptat[0].ENTRARASALA == "1") {
                if (window.openedDialog) {
                    window.openedDialog.dialog("close");
                }
                window.openedDialog = showInformationDialog("Informació", "<p class='formfontgreater1' style='text-align:center'>Repte acceptat, entrant a la sala...</p>");
                doDinsSalaRepteAcceptat(jsonMirarRepteAcceptat[0]);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        complete: function (jqXHR, textStatus) {
            //
        }
    });
}

function doDinsSalaRepteAcceptat(pJsonMirarRepteAcceptat)
{
    $.ajax({
        type: "post",
        url: "/doDinsSalaRepteAcceptat",
        datatype: "json",
        data: pJsonMirarRepteAcceptat,
        async: false,
        //cache: false,
        timeout: 3000,
        success: function (data, textStatus, jqXHR) {
            doUpdateRepteSession({
                IDREPTE: pJsonMirarRepteAcceptat["IDREPTE"],
                IDPARTIDA: pJsonMirarRepteAcceptat["IDPARTIDA"],
                TIPUSJUGADOR: pJsonMirarRepteAcceptat["TIPUSJUGADOR"],
                ELMEUCOLOR: pJsonMirarRepteAcceptat["ELMEUCOLOR"],
                TEMPS: pJsonMirarRepteAcceptat["TEMPS"],
                TEMPSINCREMENT: pJsonMirarRepteAcceptat["TEMPSINCREMENT"],
                AMBEVALUACIOELO: pJsonMirarRepteAcceptat["AMBEVALUACIOELO"],
                IDJUGADORCONTRINCANT: pJsonMirarRepteAcceptat["IDJUGADORCONTRINCANT"]
            });
            //window.location = "./sala.htm";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        complete: function (jqXHR, textStatus) {
            //
        }
    });
}

function buttonAcceptarCrearRepteOnClick()
{
    doCrearRepte($('#formCrearRepte').serialize());
    $("#dialogCrearRepte").dialog("close");
}

function buttonCancelarCrearRepteOnClick()
{
    $("#dialogCrearRepte").dialog("close");
}

function loadDialogCrearRepte(pIdObj) {

    $.ajax({
        url: "../dialog/dialogCrearRepte.htm",
        type: "post",
        async: true,
        //cache: true,
        timeout: 3000,
        success: function (result) {
            $("#dialogCrearRepte").html(result);
            if (!jsonSession) {
                jsonSession = doGetSession();
            }
            $("#REPTE_IDJUGADORREPTADOR").val(jsonSession[0].IDJUGADOR);
            $("#dialogCrearRepte").dialog({
                title: "Nou repte",
                autoOpen: false,
                height: 230,
                width: 342,
                modal: true,
                resizable: false,
                buttons:
                        [{
                                text: "Accepta",
                                id: "buttonAcceptarCrearRepte",
                                name: "buttonAcceptarCrearRepte",
                                click: function () {
                                    buttonAcceptarCrearRepteOnClick();
                                }
                            }, {
                                text: "Tanca",
                                id: "buttonCancelarCrearRepte",
                                name: "buttonCancelarCrearRepte",
                                click: function () {
                                    buttonCancelarCrearRepteOnClick();
                                }
                            }],
                open: function (event, ui) {
                    //
                },
                close: function (event, ui) {
                    //
                }
            });
            $("#dialogCrearRepte").dialog("open");
        }
    });
}

function goToAnteriorPagRepte()
{
    document.getElementById("inputNumPagActualRepte").value = document.getElementById("inputNumPagAnteriorRepte").value;
    doOmplirLlistaRepte();
}

function goToSeguentPagRepte()
{
    document.getElementById("inputNumPagActualRepte").value = document.getElementById("inputNumPagSeguentRepte").value;
    doOmplirLlistaRepte();
}

function doOmplirLlistaRepteSub(pValueJugadorReptador, pValueAmbEvaluacioElo, pValueNumPagActual)
{
    $.ajax({
        url: "/doListRepte",
        type: 'post',
        datatype: 'json',
        data: "REPTELLISTAT_JUGADORREPTADOR_DESC=" + pValueJugadorReptador +
                "&REPTELLISTAT_AMBEVALUACIOELO=" + pValueAmbEvaluacioElo,
        async: true,
        //cache: false,
        timeout: 3000,
        success: function (data) {

            //console.log("data:", data);

            if (data.length >= 0) {
                var html = "<tr>" +
                        "<td width='10%' style='height: 0px;'>" +
                        "<!-- // -->" +
                        "</td>" +
                        "<td width='40%'>" +
                        "<!-- // -->" +
                        "</td>" +
                        "<td width='30%'>" +
                        "<!-- // -->" +
                        "</td>" +
                        "<td width='20%'>" +
                        "<!-- // -->" +
                        "</td>" +
                        "</tr>";
                var regIniFin_ = new regIniFin(pValueNumPagActual, data.length);
                var iniReg = regIniFin_.reg_ini;
                var finReg = regIniFin_.reg_fin;
                var nRows = 0;
                if (!jsonSession) {
                    jsonSession = doGetSession();
                }
                var nickJugadorSession = jsonSession[0].user; //.NICKJUGADOR;
                for (var i = iniReg; i < finReg; i++) {

                    var reg = data[i];

                    html += "<tr>" +
                            "<td class='formfont' style='text-align: center; height: 25px;'>";

                    if (nickJugadorSession == reg.REPTELLISTAT_JUGADORREPTADOR_DESC) {

                        html += "<img alt='eliminar' src='../resources/img/eliminarLista.PNG' style='cursor: pointer' onclick='javascript: doEliminarRepte(" + reg.REPTELLISTAT_ID + ");' title='Elimina el Repte'>";

                    } else {

                        html += "<img alt='acceptar' src='../resources/img/acceptar.PNG' style='cursor: pointer' onclick='javascript: doAcceptarRepte(" + reg.REPTELLISTAT_ID + ");' title='Accepta el Repte'>";

                    }

                    html += "</td>" +
                            "<td class='formfont' style='text-align: left; padding-left: 5px'>" +
                            "<label><b>" + reg.REPTELLISTAT_JUGADORREPTADOR_DESC + "</b>" +
                            " (amb " + reg.REPTELLISTAT_COLORJUGADORREPTADOR + ")" +
                            "</label>" +
                            "</td>" +
                            "<td class='formfont' style='text-align: left; padding-left: 5px'>";

                    var tempsAMostrar = "";
                    var temps = reg.REPTELLISTAT_TEMPS;
                    var tempsEnHores = temps / 3600;
                    var tempsEnMinuts = temps / 60;
                    if (tempsEnHores >= 1) {
                        var h = getPartNumber(tempsEnHores, 'int', 2);
                        var min = getPartNumber(tempsEnHores, 'frac', 2);
                        min = min / 60;
                        tempsAMostrar = h + "h. ";
                        if (min > 0) {
                            tempsAMostrar += " i " + min + "min."
                        }
                    } else {
                        tempsAMostrar = tempsEnMinuts + " min. ";
                    }

                    if (reg.REPTELLISTAT_TEMPSINCREMENT != 0) {
                        tempsAMostrar += " + " + reg.REPTELLISTAT_TEMPSINCREMENT + " seg. incr.";
                    }

                    html += "<label>" + tempsAMostrar + "</label>" +
                            "</td>" +
                            "<td class='formfont' style='text-align: left; padding-left: 5px'>" +
                            "<label>" + reg.REPTELLISTAT_AMBEVALUACIOELO_DESC + "</label>" +
                            "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td colspan='4' style='height: 5px; background-image: url(../resources/img/separadorFilasLista.PNG); background-repeat: repeat-x;'>" +
                            "</td>" +
                            "</tr>";
                    nRows++;
                }

                //afegim les files buides fins que arribem a màx. per pàg.
                for (var i = 1; i <= regIniFin_.max_reg_por_pag - nRows; i++) {
                    html += "<tr>" +
                            "<td colspan='4' class='formfont' style='text-align: center; height: 25px;'>" +
                            "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td colspan='4' style='height: 5px; background-image: url(../resources/img/separadorFilasLista.PNG); background-repeat: repeat-x;'>" +
                            "</td>" +
                            "</tr>";
                }

                $("#subTableRepte").html(html);
                $("#labelAlRepteLlistatSize").html(data.length + " repte(s)");
                $("#inputNumPagAnteriorRepte").val(regIniFin_.num_pag_anterior);
                $("#inputNumPagSeguentRepte").val(regIniFin_.num_pag_siguiente);
                $("#inputNumPagActualPagMaxRepte").val(regIniFin_.num_pag_actual + " de " + regIniFin_.num_pag_max);
            } else {
                $(".labError").text("No hi ha reptes");
            }
        },
        error: function (s, i, error) {
            //window.location = "../../login.htm";
            console.log(error);
        }
    });
}

function doOmplirLlistaRepte()
{
    //$.ajaxSetup({cache: false});
    clearIntervalLlista("PAG_LLISTA_REPTE");
    //filtres de la llista
    var objJugadorReptador = document.getElementById("nickJugadorReptador");
    var objAmbEvaluacioElo = document.getElementById("ambEvaluacioElo");
    var objNumPagActual = document.getElementById("inputNumPagActualRepte");
    var valueJugadorReptador = objJugadorReptador.value;
    var valueAmbEvaluacioElo = objAmbEvaluacioElo.value;
    var valueNumPagActual = objNumPagActual.value;
    doOmplirLlistaRepteSub(valueJugadorReptador, valueAmbEvaluacioElo, valueNumPagActual);
    //actualitzem la llista cada 5 seg. (5000)
    window.refreshLlistaRepte = self.setInterval(function () {
        try {
            doOmplirLlistaRepteSub(valueJugadorReptador, valueAmbEvaluacioElo, valueNumPagActual);
        } finally {
            doMirarRepteAcceptat();
        }
    }, 5000);

}

function doCrearRepte(pParams)
{
    var sOk = "0";
    $.ajax({
        type: "post",
        url: "/doCrearRepte",
        datatype: "text",
        data: pParams,
        async: true,
        //cache: false,
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
    return sOk;
}

function doEliminarRepte(pIdRepte)
{
    var sOk = "0";
    var fnYes = function () {
        $.ajax({
            type: "post",
            url: "/doEliminarRepte",
            datatype: "text",
            data: "REPTELLISTAT_ID=" + pIdRepte,
            async: true,
            //cache: false,
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
    showConfirmationDialog("Confirmació", "Vols eliminar aquest repte?", fnYes, fnNo);
    return sOk;
}

function doAcceptarRepte(pIdRepte)
{
    if (!jsonSession) {
        jsonSession = doGetSession();
    }
    var sOk = "0";
    $.ajax({
        type: "post",
        url: "/doAcceptarRepte",
        datatype: "text",
        data: "REPTELLISTAT_ID=" + pIdRepte +
                "&REPTELLISTAT_IDJUGADORREPTAT=" + jsonSession[0].IDJUGADOR,
        async: true,
        //cache: false,
        timeout: 3000,
        success: function (data, textStatus, jqXHR) {
            if (window.openedDialog) {
                window.openedDialog.dialog("close");
            }
            window.openedDialog = showInformationDialog("Informació", "<p class='formfontgreater1' style='text-align:center'>Repte enviat, esperant per entrar a la sala...</p>");
            //doOmplirLlistaRepte();
            sOk = "1";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            sOk = "0";
        },
        complete: function (jqXHR, textStatus) {
            //alert("Esperant entrar a la sala...");
        }
    });
    return sOk;
}

function doLogout() {
    $.ajax({
        url: '/doLogout',
        type: 'post',
        datatype: 'json',
        data: "",
        success: function (data) {
            if (data == "1") {
                clearIntervalLlista("PAG_LLISTA_JUGADOR");
                clearIntervalLlista("PAG_LLISTA_REPTE");
                window.location = "./login.htm";
            }
        },
        error: function (s, i, error) {
            console.log(error);
        }
    });
}

//////////////////////////////////// fin repte /////////////////////////////////




