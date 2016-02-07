
window.openedDialog = null;

var finishedOmplirLlistaJugador = false;
var finishedOmplirLlistaRepte = false;
var finishedOmplirLlistaPartida = false;

$(document).ready(function () {

    $("#capcaleraPag").html(htmlCapcaleraPag());
    
    var xhr = getXHRSession();
    $.when($.ajax(xhr)).then(
        //function primer param --> ajax success!!!
        function (pSessionData, textStatus, jqXHR)
        {
            var jsonSession = pSessionData;
            $("#labNickJugadorSessio").html("Sessió iniciada per: <b>" + jsonSession[0].user + "</b>");
        }
    );
    
    

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
            timeout: 30000,
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
    doOmplirLlistaPartida();

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
    finishedOmplirLlistaJugador = false;
    $.ajax({
        url: '/doListJugador',
        type: 'post',
        datatype: 'json',
        data: "JUGADORLLISTAT_NICK=" + pValueNick +
                "&JUGADORLLISTAT_PERFIL_DESC=" + pValuePerfil_desc +
                "&JUGADORLLISTAT_ESTAT=" + pValueEstat,
        async: true,
        //cache: false,
        timeout: 30000,
        success: function (data) {

            var xhr = getXHRSession();
            $.when($.ajax(xhr)).then(
                //function primer param --> ajax success!!!
                function (pSessionData, textStatus, jqXHR)
                {
                    try {
                        var jsonSession = pSessionData;
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
                                html += "<tr>" +
                                        "<td class='formfont' style='text-align: center; height: 25px;'>";
                                if (reg.JUGADORLLISTAT_ID === jsonSession[0].IDJUGADOR) {
                                    html += "<!-- // -->";
                                } else {
                                    html += "<img src='../resources/img/challenge.PNG' alt='reptar' title='Reptar al jugador' style='cursor: pointer;'";
                                    if (reg.JUGADORLLISTAT_ESTAT === 0) {
                                        html += " onclick='javascript: reptarJugador(" + reg.JUGADORLLISTAT_ID + ")'>";
                                    } else if (reg.JUGADORLLISTAT_ESTAT === -1) {
                                        html += " onclick=\"javascript: showInformationDialog(&quot;Informació&quot;, &quot;<p class=\'formfontgreater1\' style=\'text-align:center\'>En aquests moments <b>" + reg.JUGADORLLISTAT_NICK + "</b> està desconnectat!</p>&quot;);\">";
                                    } else if (reg.JUGADORLLISTAT_ESTAT === 1) {
                                        html += " onclick=\"javascript: showInformationDialog(&quot;Informació&quot;, &quot;<p class=\'formfontgreater1\' style=\'text-align:center\'>En aquests moments <b>" + reg.JUGADORLLISTAT_NICK + "</b> està reptant a una altra persona.</p>&quot;);\">";
                                    } else if (reg.JUGADORLLISTAT_ESTAT === 2) {
                                        html += " onclick=\"javascript: showInformationDialog(&quot;Informació&quot;, &quot;<p class=\'formfontgreater1\' style=\'text-align:center\'>En aquests moments <b>" + reg.JUGADORLLISTAT_NICK + "</b> està jugant amb una altra persona, espera que acabi.</p>&quot;);\">";
                                    }
                                }

                                html += "</td>" +
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
            finishedOmplirLlistaJugador = true;
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

function doOmplirLlistaJugador(pResetPag)
{
    //$.ajaxSetup({cache: false});
    clearIntervalLlista(PAG_LLISTA_JUGADOR);
    //filtres de la llista
    var objNick = document.getElementById("nick");
    var objEstat = document.getElementById("estat");
    var objNumPagActual = document.getElementById("inputNumPagActualJugador");
    if (pResetPag) {
        objNumPagActual.value = "1";
    }
    var valueNick = objNick.value;
    var valuePerfil_desc = "";
    var valueEstat = objEstat.value;
    var valueNumPagActual = objNumPagActual.value;
    doOmplirLlistaJugadorSub(valueNick, valuePerfil_desc, valueEstat, valueNumPagActual);
    //actualitzem la llista cada 5 seg. (5000)
    window.refreshLlistaJugador = self.setInterval(function () {
        if (finishedOmplirLlistaJugador === true) {
            doOmplirLlistaJugadorSub(valueNick, valuePerfil_desc, valueEstat, valueNumPagActual);
        }
    }, 5000);
}

function onKeyPressFilterJugador(evt) {
    var keyPressed = (evt.which) ? evt.which : event.keyCode;
    if (keyPressed === 13) {
        doOmplirLlistaJugador(true);
    }
}

function onKeyPressFilterRepte(evt) {
    var keyPressed = (evt.which) ? evt.which : event.keyCode;
    if (keyPressed === 13) {
        doOmplirLlistaRepte(true);
    }
}

function onKeyPressFilterPartida(evt) {
    var keyPressed = (evt.which) ? evt.which : event.keyCode;
    if (keyPressed === 13) {
        doOmplirLlistaPartida(true);
    }
}

//////////////////////////////////// fin jugador ///////////////////////////////



//////////////////////////////////// ini repte /////////////////////////////////
function doMirarReptesAMi(pSessionIdJugador)
{
    try {
        $.ajax({
            type: "post",
            url: "/doMirarReptesAMi",
            datatype: "json",
            data: "REPTELLISTAT_IDJUGADORREPTAT=" + pSessionIdJugador,
            async: true,
            //cache: false,
            timeout: 30000,
            success: function (data, textStatus, jqXHR) {
                var jsonMirarReptesAMi = data;
                if (jsonMirarReptesAMi[0].IDJUGADORREPTAT === pSessionIdJugador) {
                    var fnYes = function () {
                        doAcceptarRepte(jsonMirarReptesAMi[0].IDREPTE);
                    };
                    var fnNo = function () {
                        doEliminarRepte(jsonMirarReptesAMi[0].IDREPTE);
                    };
                    if (window.openedDialog) {
                        window.openedDialog.dialog("close");
                    }
                    var imgArrow = "<img src='../resources/img/arrow.PNG' alt='*' style='vertical-align: middle;'>";
                    window.openedDialog = showConfirmationDialog("Confirmació", "<p>En " + 
                            "<b>" + jsonMirarReptesAMi[0].NICKJUGADORCONTRINCANT + "</b>" +
                            " et repta a una partida." +
                            "<br>Et proposa:</p>" +
                            "<p>" +
                            "<br>"+imgArrow+" El teu color seria: <b>" + (jsonMirarReptesAMi[0].ELMEUCOLOR === "B" ? "Blanques" : "Negres") + "</b>" +
                            "<br>"+imgArrow+" Temps (min.): <b>" + jsonMirarReptesAMi[0].TEMPS + "</b>" +
                            "<br>"+imgArrow+" Increment (seg.): <b>"  + jsonMirarReptesAMi[0].TEMPSINCREMENT + "</b>" +
                            "<br>"+imgArrow+" Amb evaluació ELO: <b>" + jsonMirarReptesAMi[0].AMBEVALUACIOELO + "</b>" +
                            "</p>" +
                            "<p style='text-align: center'><b>Acceptes?</b></p>", fnYes, fnNo);
                    //doDinsSalaRepteAcceptat(jsonMirarReptesAMi[0]);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            },
            complete: function (jqXHR, textStatus) {
                //
            }
        });
    } catch (e) {
        doIfSessionFailure(e);
    }
}


function doMirarRepteAcceptat()
{
    var xhr = getXHRSession();
    $.when($.ajax(xhr)).then(
            //function primer param --> ajax success!!!
                    function (pSessionData, textStatus, jqXHR)
                    {
                        try {
                            var jsonSession = pSessionData;
                            /*if (!jsonSession) {
                             jsonSession = doGetSession();
                             }*/
                            //var res = "";
                            $.ajax({
                                type: "post",
                                url: "/doMirarRepteAcceptat",
                                datatype: "json",
                                data: "REPTELLISTAT_IDJUGADOR=" + jsonSession[0].IDJUGADOR,
                                async: true,
                                //cache: false,
                                timeout: 30000,
                                success: function (data, textStatus, jqXHR) {
                                    var jsonMirarRepteAcceptat = data;
                                    if (jsonMirarRepteAcceptat[0].ENTRARASALA == "1") {
                                        if (window.openedDialog) {
                                            window.openedDialog.dialog("close");
                                        }
                                        window.openedDialog = showInformationDialog("Informació", "<p class='formfontgreater1' style='text-align:center'>Repte acceptat, entrant a la sala...</p>");
                                        doDinsSalaRepteAcceptat(jsonMirarRepteAcceptat[0]);
                                    } else {
                                        doMirarReptesAMi(jsonSession[0].IDJUGADOR);
                                    }
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    console.log(errorThrown);
                                },
                                complete: function (jqXHR, textStatus) {
                                    //
                                }
                            });
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

        function doDinsSalaRepteAcceptat(pJsonMirarRepteAcceptat)
        {
            $.ajax({
                type: "post",
                url: "/doDinsSalaRepteAcceptat",
                datatype: "json",
                data: pJsonMirarRepteAcceptat,
                async: false,
                //cache: false,
                timeout: 30000,
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
                    }, "./sala.htm");
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

        function buttonAcceptarCrearRepteOnClick(pIdJugadorReptat)
        {
            var valueRepteTemps = $('#REPTE_TEMPS').val();
            if (valueRepteTemps.trim() === '' || isNaN(valueRepteTemps) === true || (isNaN(valueRepteTemps) === false && parseInt(valueRepteTemps) === 0)) {
                showAlertDialog("Informació", "<p>Has d'escriure un nombre vàlid i més gran que 0.</p>");
                return;
            } 
            //if (pIdJugadorReptat) {

            //} else {
                doCrearRepte($('#formCrearRepte').serialize());
            //}
            $("#dialogCrearRepte").dialog("close");
        }

        function buttonCancelarCrearRepteOnClick()
        {
            $("#dialogCrearRepte").dialog("close");
        }

        function reptarJugador(pIdJugadorReptat) {
            loadDialogCrearRepte(pIdJugadorReptat);
        }

        function loadDialogCrearRepte(pIdJugadorReptat)
        {
            $.ajax({
                url: "../dialog/dialogCrearRepte.htm",
                type: "post",
                async: true,
                //cache: true,
                timeout: 30000,
                success: function (result) {
                    var xhr = getXHRSession();
                    $.when($.ajax(xhr)).then(
                            //function primer param --> ajax success!!!
                                    function (pSessionData, textStatus, jqXHR)
                                    {
                                        try {
                                            var jsonSession = pSessionData;
                                            /*if (!jsonSession) {
                                             jsonSession = doGetSession();
                                             }*/
                                            $("#dialogCrearRepte").html(result);
                                            if (pIdJugadorReptat) {
                                                $("#REPTE_IDJUGADORREPTAT").val(pIdJugadorReptat);
                                            }
                                            $("#REPTE_IDJUGADORREPTADOR").val(jsonSession[0].IDJUGADOR);
                                            $("#dialogCrearRepte").dialog({
                                                title: (pIdJugadorReptat) ? "Reptar a..." : "Nou repte",
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
                                                                    buttonAcceptarCrearRepteOnClick(pIdJugadorReptat);
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
                                    /*$("#dialogCrearRepte").html(result);
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
                                     $("#dialogCrearRepte").dialog("open");*/
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
            finishedOmplirLlistaRepte === false;
            $.ajax({
                url: "/doListRepte",
                type: 'post',
                datatype: 'json',
                data: "REPTELLISTAT_JUGADORREPTADOR_DESC=" + pValueJugadorReptador +
                        "&REPTELLISTAT_AMBEVALUACIOELO=" + pValueAmbEvaluacioElo,
                async: true,
                //cache: false,
                timeout: 30000,
                success: function (data) {

                    var xhr = getXHRSession();
                    $.when($.ajax(xhr)).then(
                            //function primer param --> ajax success!!!
                                    function (pSessionData, textStatus, jqXHR)
                                    {
                                        try {
                                            var jsonSession = pSessionData;
                                            /*if (!jsonSession) {
                                             jsonSession = doGetSession();
                                             }*/
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
                                                var nickJugadorSession = jsonSession[0].user; //.NICKJUGADOR;
                                                for (var i = iniReg; i < finReg; i++) {

                                                    var reg = data[i];

                                                    html += "<tr>" +
                                                            "<td class='formfont' style='text-align: center; height: 25px;'>";

                                                    if (nickJugadorSession == reg.REPTELLISTAT_JUGADORREPTADOR_DESC) {

                                                        html += "<img alt='eliminar' src='../resources/img/eliminarLista.PNG' style='cursor: pointer' onclick='javascript: doEliminarRepte(" + reg.REPTELLISTAT_ID + ", true);' title='Elimina el Repte'>";

                                                    } else {

                                                        html += "<img alt='acceptar' src='../resources/img/acceptar.PNG' style='cursor: pointer' ";
                                                        
                                                        if (reg.REPTELLISTAT_ESTATJUGADORREPTADOR === 0) {
                                                            html += " onclick='javascript: doAcceptarRepte(" + reg.REPTELLISTAT_ID + ");' title='Accepta el Repte'>";
                                                        } else if (reg.REPTELLISTAT_ESTATJUGADORREPTADOR === -1) {
                                                            html += " onclick=\"javascript: showInformationDialog(&quot;Informació&quot;, &quot;<p class=\'formfontgreater1\' style=\'text-align:center\'>En aquests moments <b>" + reg.REPTELLISTAT_JUGADORREPTADOR_DESC + "</b> està desconnectat!</p>&quot;);\">";
                                                        } else if (reg.REPTELLISTAT_ESTATJUGADORREPTADOR === 1) {
                                                            html += " onclick=\"javascript: showInformationDialog(&quot;Informació&quot;, &quot;<p class=\'formfontgreater1\' style=\'text-align:center\'>En aquests moments <b>" + reg.REPTELLISTAT_JUGADORREPTADOR_DESC + "</b> està reptant a una altra persona.</p>&quot;);\">";
                                                        } else if (reg.REPTELLISTAT_ESTATJUGADORREPTADOR === 2) {
                                                            html += " onclick=\"javascript: showInformationDialog(&quot;Informació&quot;, &quot;<p class=\'formfontgreater1\' style=\'text-align:center\'>En aquests moments <b>" + reg.REPTELLISTAT_JUGADORREPTADOR_DESC + "</b> està jugant amb una altra persona, espera que acabi.</p>&quot;);\">";
                                                        }
                                                        

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
                                            finishedOmplirLlistaRepte = true;

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

                                },
                        error: function (s, i, error) {
                            //window.location = "../../login.htm";
                            console.log(error);
                        }
                    });
        }

        function doOmplirLlistaRepte(pResetPag)
        {
            //$.ajaxSetup({cache: false});
            clearIntervalLlista(PAG_LLISTA_REPTE);
            //filtres de la llista
            var objJugadorReptador = document.getElementById("nickJugadorReptador");
            var objAmbEvaluacioElo = document.getElementById("ambEvaluacioElo");
            var objNumPagActual = document.getElementById("inputNumPagActualRepte");
            if (pResetPag) {
                objNumPagActual.value = "1";
            }
            var valueJugadorReptador = objJugadorReptador.value;
            var valueAmbEvaluacioElo = objAmbEvaluacioElo.value;
            var valueNumPagActual = objNumPagActual.value;
            doOmplirLlistaRepteSub(valueJugadorReptador, valueAmbEvaluacioElo, valueNumPagActual);
            //actualitzem la llista cada 5 seg. (5000)
            window.refreshLlistaRepte = self.setInterval(function () {
                if (finishedOmplirLlistaRepte === true) {
                    try {
                        doOmplirLlistaRepteSub(valueJugadorReptador, valueAmbEvaluacioElo, valueNumPagActual);
                    } finally {
                        doMirarRepteAcceptat();
                    }
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
                timeout: 30000,
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

        function doEliminarRepte(pIdRepte, pWithConfirmationDialog)
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
                    timeout: 30000,
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
            if (pWithConfirmationDialog) {
                showConfirmationDialog("Confirmació", "Vols eliminar aquest repte?", fnYes, fnNo);
            } else {
                fnYes();
            }
            return sOk;
        }

        function doAcceptarRepte(pIdRepte)
        {
            var xhr = getXHRSession();
            $.when($.ajax(xhr)).then(
                    //function primer param --> ajax success!!!
                            function (pSessionData, textStatus, jqXHR)
                            {
                                try {
                                    var jsonSession = pSessionData;
                                    /*if (!jsonSession) {
                                     jsonSession = doGetSession();
                                     }*/
                                    //var sOk = "0";
                                    $.ajax({
                                        type: "post",
                                        url: "/doAcceptarRepte",
                                        datatype: "text",
                                        data: "REPTELLISTAT_ID=" + pIdRepte +
                                                "&REPTELLISTAT_IDJUGADORREPTAT=" + jsonSession[0].IDJUGADOR,
                                        async: true,
                                        //cache: false,
                                        timeout: 30000,
                                        success: function (data, textStatus, jqXHR) {
                                            if (window.openedDialog) {
                                                window.openedDialog.dialog("close");
                                            }
                                            window.openedDialog = showInformationDialog("Informació", "<p class='formfontgreater1' style='text-align:center'>Repte enviat, esperant per entrar a la sala...</p>");
                                            //doOmplirLlistaRepte();
                                            //sOk = "1";
                                        },
                                        error: function (jqXHR, textStatus, errorThrown) {
                                            //sOk = "0";
                                        },
                                        complete: function (jqXHR, textStatus) {
                                            //alert("Esperant entrar a la sala...");
                                        }
                                    });
                                    //return sOk;
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








        function goToAnteriorPagPartida()
        {
            document.getElementById("inputNumPagActualPartida").value = document.getElementById("inputNumPagAnteriorPartida").value;
            doOmplirLlistaPartida();
        }

        function goToSeguentPagPartida()
        {
            document.getElementById("inputNumPagActualPartida").value = document.getElementById("inputNumPagSeguentPartida").value;
            doOmplirLlistaPartida();
        }

        function doOmplirLlistaPartidaSub(pValueJugadorBlanques, pValueJugadorNegres, pValueResultat, pValueNumPagActual)
        {
            finishedOmplirLlistaPartida === false;
            $.ajax({
                url: "/doListPartida",
                type: 'post',
                datatype: 'json',
                data: "PARTIDALLISTAT_JUGADORBLANQUES_DESC=" + pValueJugadorBlanques +
                        "&PARTIDALLISTAT_JUGADORNEGRES_DESC=" + pValueJugadorNegres +
                        "&PARTIDALLISTAT_RESULTAT=" + pValueResultat,
                async: true,
                //cache: false,
                timeout: 30000,
                success: function (data) {

                    var xhr = getXHRSession();
                    $.when($.ajax(xhr)).then(
                            //function primer param --> ajax success!!!
                                    function (pSessionData, textStatus, jqXHR)
                                    {
                                        try {
                                            var jsonSession = pSessionData;
                                            /*if (!jsonSession) {
                                             jsonSession = doGetSession();
                                             }*/
                                            if (data.length >= 0) {
                                                var html = "<tr>" +
                                                        "<td width='10%' style='height: 0px;'>" +
                                                        "<!-- // -->" +
                                                        "</td>" +
                                                        "<td width='40%'>" +
                                                        "<!-- // -->" +
                                                        "</td>" +
                                                        "<td width='40%'>" +
                                                        "<!-- // -->" +
                                                        "</td>" +
                                                        "<td width='10%'>" +
                                                        "<!-- // -->" +
                                                        "</td>" +
                                                        "</tr>";
                                                var regIniFin_ = new regIniFin(pValueNumPagActual, data.length);
                                                var iniReg = regIniFin_.reg_ini;
                                                var finReg = regIniFin_.reg_fin;
                                                var nRows = 0;
                                                for (var i = iniReg; i < finReg; i++) {

                                                    var reg = data[i];

                                                    html += "<tr>";
                                                    
                                                    html += "<td class='formfont' style='text-align: center; height: 25px;'>";
                                                    html += "<img alt='veure' src='../resources/img/mirarPartida.PNG' style='cursor: pointer' onclick='javascript: doVeurePartida(" + reg.PARTIDALLISTAT_ID + ");' title='Veure la partida'>";
                                                    html += "</td>";
                                                    
                                                    html += "<td class='formfont' style='text-align: left; padding-left: 5px'>" +
                                                            "<label><b>" + reg.PARTIDALLISTAT_JUGADORBLANQUES_DESC + "</b>" +
                                                            "</label>" +
                                                            "</td>" +
                                                            
                                                            "<td class='formfont' style='text-align: left; padding-left: 5px'>" +
                                                            "<label><b>" + reg.PARTIDALLISTAT_JUGADORNEGRES_DESC + "</b>" +
                                                            "</label>" +
                                                            "</td>" +
                                                            "<td class='formfont' style='text-align: left; padding-left: 5px'>" +
                                                            "<label><b>" + reg.PARTIDALLISTAT_RESULTAT_DESC + "</b>" +
                                                            "</label>" +
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

                                                $("#subTablePartida").html(html);
                                                $("#labelAlPartidaLlistatSize").html(data.length + " partida(es)");
                                                $("#inputNumPagAnteriorPartida").val(regIniFin_.num_pag_anterior);
                                                $("#inputNumPagSeguentPartida").val(regIniFin_.num_pag_siguiente);
                                                $("#inputNumPagActualPagMaxPartida").val(regIniFin_.num_pag_actual + " de " + regIniFin_.num_pag_max);
                                            } else {
                                                $(".labError").text("No hi ha partides");
                                            }
                                            finishedOmplirLlistaPartida = true;

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

                                },
                        error: function (s, i, error) {
                            //window.location = "../../login.htm";
                            console.log(error);
                        }
                    });
        }                

        function doOmplirLlistaPartida(pResetPag)
        {
            //$.ajaxSetup({cache: false});
            clearIntervalLlista(PAG_LLISTA_PARTIDA);
            //filtres de la llista
            var objJugadorBlanques = document.getElementById("nickJugadorBlanques");
            var objJugadorNegres = document.getElementById("nickJugadorNegres");
            var objResultat = document.getElementById("resultat");
            var objNumPagActual = document.getElementById("inputNumPagActualPartida");
            if (pResetPag) {
                objNumPagActual.value = "1";
            }
            var valueJugadorBlanques = objJugadorBlanques.value;
            var valueJugadorNegres = objJugadorNegres.value;
            var valueResultat = objResultat.value;
            var valueNumPagActual = objNumPagActual.value;
            doOmplirLlistaPartidaSub(valueJugadorBlanques, valueJugadorNegres, valueResultat, valueNumPagActual);
            //actualitzem la llista cada 60 seg. (60000)
            window.refreshLlistaPartida = self.setInterval(function () {
                if (finishedOmplirLlistaPartida === true) {
                    try {
                        doOmplirLlistaPartidaSub(valueJugadorBlanques, valueJugadorNegres, valueResultat, valueNumPagActual);
                    } finally {
                        //
                    }
                }
            }, 60000);

        }


function doVeurePartida(pIdPartida) {
    doUpdateVeurePartidaSession({
        IDPARTIDA: pIdPartida
    }, "./veurePartida.htm");
    //window.location = "./veurePartida.htm?mirarpartida=1&IDPARTIDA="+pIdPartida;
}


function doLogout() {
    
    var fnYes = function () {
        $.ajax({
            url: '/doLogout',
            type: 'post',
            datatype: 'json',
            data: "",
            success: function (data) {
                if (data == "1") {
                    clearIntervalLlista(PAG_LLISTA_JUGADOR);
                    clearIntervalLlista(PAG_LLISTA_REPTE);
                    window.location = "./login.htm";
                }
            },
            error: function (s, i, error) {
                console.log(error);
            }
        });
    };
    var fnNo = function () {
        //
    };
    showConfirmationDialog("Confirmació", "Vols sortir?", fnYes, fnNo);
    
}

//////////////////////////////////// fin repte /////////////////////////////////




