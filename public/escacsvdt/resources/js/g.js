
var jsonSession;

function htmlCapcaleraPag() {
    var str = "<table style='width: 100%; border: 0px;'>";
    str += "  <tr>";
    str += "    <td colspan='5'>";
    str += "      <table style='width: 100%' border='0'>";
    str += "        <tr>";
    str += "          <td style='width: 34%' align='left'>";
    str += "            <img src='../resources/img/LogoClubEscacsVDT_petit.jpg' >";
    str += "          </td>";
    str += "        </tr>";
    str += "      </table>";
    str += "    </td>";
    str += "  </tr>";
    str += "  <tr style='background-image: url(\"../resources/img/barrasuperior.PNG\"); background-repeat: repeat-x;'>";
    str += "    <td colspan='5' style='height: 10px'>";
    str += "      <!-- // -->";
    str += "    </td>";
    str += "  </tr>";
    str += "</table>";
    return str;
}

function doGetSession() {
    var result = '';
    $.ajax({
        url: '/doGetSession',
        type: 'post',
        datatype: 'json',
        data: "",
        async: false,
        cache: false,
        success: function (data) {
            result = data;
            if (result == "") {
                window.location = './login.htm';
            }
        },
        error: function (s, i, error) {
            result = error;
            window.location = './login.htm';
        }
    });
    return result;
}

function doUpdateRepteSession(pJsonRepteAcceptat) {
    var result = "0";
    $.ajax({
        url: '/doUpdateRepteSession',
        type: 'post',
        datatype: 'json',
        data: pJsonRepteAcceptat,
        async: false,
        cache: false,
        success: function (data) {
            result = "1";
            window.location = "./sala.htm";
        },
        error: function (s, i, error) {
            result = "0";
            console.log(error);
            //window.location = "./login.htm";
        }
    });
    return result;
}

function introOnInput(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla === 13)
        document.forms[0].submit();
}




function regIniFin(pNumPagActual, pListLength) {

    this.max_reg_por_pag = 10;
    this.min_reg_pag = 1;
    this.reg_ini = 0;
    this.reg_fin = 0;
    this.num_pag_actual = parseInt(pNumPagActual);
    this.num_pag_anterior = 1;
    this.num_pag_siguiente = 1;
    this.num_pag_max = 1;

    var trunc = function (n) {
        return Number(String(n).replace(/\..*/, ""));
    };

    var iMaxRegPorPag = parseInt(this.max_reg_por_pag);
    var iNumPagAnterior = parseInt(this.min_reg_pag);
    var iNumPagSiguiente = parseInt(this.min_reg_pag);
    var iNumPagActual = parseInt(pNumPagActual);
    if (iNumPagActual == null || iNumPagActual == undefined) {
        iNumPagActual = this.min_reg_pag;
    }
    var iNumPagMax = parseInt(this.min_reg_pag);

    var iRegIni = 0;
    iRegIni = (iNumPagActual - 1) * iMaxRegPorPag;

    var iRegFin = iRegIni + iMaxRegPorPag;
    iRegFin = (iRegFin > pListLength) ? pListLength : iRegFin;
    if (iNumPagActual > 1) {
        iNumPagAnterior = iNumPagActual - 1;
    } else {
        iNumPagAnterior = 1;
    }
    iNumPagMax = trunc((pListLength / iMaxRegPorPag) * 100 / 100);
    if (pListLength % iMaxRegPorPag !== 0) {
        iNumPagMax++;
    }
    if (iNumPagMax > iNumPagActual) {
        iNumPagSiguiente = iNumPagActual + 1;
    } else {
        iNumPagSiguiente = iNumPagActual;
    }

    this.reg_ini = iRegIni;
    this.reg_fin = iRegFin;
    this.num_pag_actual = iNumPagActual;
    this.num_pag_anterior = iNumPagAnterior;
    this.num_pag_siguiente = iNumPagSiguiente;
    this.num_pag_max = iNumPagMax;
}

function showInformationDialog(pTitle, pMessage) {
    var dialog = $("<div><p style='text-align: center'>" + pMessage + "</p></div>").dialog({
        title: pTitle,
        autoOpen: true,
        modal: true,
        width: 350,
        resizable: false,
        buttons: [{
                text: "Tanca",
                id: "buttonNo",
                name: "buttonNo",
                click: function () {
                    dialog.dialog('close');
                }
            }],
        open: function () {
            //
        },
        close: function () {
            //
        }
    });
    return dialog;
}

function showConfirmationDialog(pTitle, pMessage, pFnYes, pFnNo) {
    var dialog = $("<div><p style='text-align: center'>" + pMessage + "</p></div>").dialog({
        title: pTitle,
        autoOpen: true,
        modal: true,
        width: 350,
        resizable: false,
        buttons: [{
                text: "Sí",
                id: "buttonSi",
                name: "buttonSi",
                click: function () {
                    pFnYes();
                    dialog.dialog('close');
                }
            }, {
                text: "No",
                id: "buttonNo",
                name: "buttonNo",
                click: function () {
                    pFnNo();
                    dialog.dialog('close');
                }
            }],
        open: function () {
            //
        },
        close: function () {
            //
        }
    });
    return dialog;
}

