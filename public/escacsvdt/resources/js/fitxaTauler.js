
//guarda FitxaDades associat a un element del DOM (fitxa)
//var allData = new Map();
//var _allData = new Map();

//guarda les Fitxa al Tauler
var arrayTauler = new Array();
var _arrayTauler = new Array();

//guarda les esteles de les Fitxa al Tauler
var arrayEsteles = new Array();
var _arrayEsteles = new Array();

//var dragging = false;
//var draggingCasella = {x:0,y:0};
//var isOKMove = false;

var llistaFitxesMogudes = new Array();


$(document).ready(function () {

    //recollir el color usuari de base de dades (a partir de repte_id) !!!
    //addFitxesInArrayTauler(param_colorUsuari);

});


//per a arrayTauler
function create2DArray(rows, cols, defaultValue) {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(cols);
        for (var j = 0; j < cols; j++) {
            // Initializes:
            arr[i][j] = defaultValue;
        }
    }
    return arr;
}

//per a arrayEsteles
function create3DArray(rows, cols, zed, defaultValue) {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(cols);
        for (var j = 0; j < cols; j++) {
            arr[i][j] = new Array(zed);
            for (var k = 0; k < cols; k++) {
                // Initializes:
                arr[i][j][k] = defaultValue;
            }
        }
    }
    return arr;
}

//get FitxaDades d'un element del DOM (fitxa) 
function getFitxaDadesFromElDOM(pCmd, elDOM) {
    if (elDOM) {
        //que segueixi endavant
    } else {
        return null;
    }
    var idElDOM = "";
    if (typeof elDOM == "string") {
        idElDOM = elDOM;
        elDOM = getElDOMByNom(elDOM);
    } else {
        idElDOM = elDOM.id;
    }
    var fD = null;
    if (elDOM) {
        if (pCmd == TAULER_REAL) { // && allData) {

            fD = elDOM.fD;
            //fD = allData.get(elDOM);

        } else if (pCmd == TAULER_VIRTUAL) { // && _allData) {

            var firstChar = idElDOM.charAt(0);
            if (firstChar != '_')
                idElDOM = "_" + idElDOM;
            elDOM = getElDOMByNom(idElDOM);

            fD = elDOM.fD;
            //fD = _allData.get(elDOM);

        }
    }
    if (fD) {
        fD.cmd = pCmd;
    }
    return fD;
}

//set FitxaDades cap a un element del DOM (fitxa) 
function setFitxaDadesToElDOM(pCmd, elDOM, pFD) {
    var idElDOM = "";
    if (typeof elDOM == "string") {
        idElDOM = elDOM;
        elDOM = getElDOMByNom(elDOM);
    } else {
        idElDOM = elDOM.id;
    }
    if (elDOM) {
        if (pCmd == TAULER_REAL) { // && allData) {
            /*if (!allData.has(key)) {
             allData.set(key, {});
             }*/

            elDOM.fD = pFD;

            //allData.set(elDOM, pFD);
        } else if (pCmd == TAULER_VIRTUAL) { // && _allData) {
            var firstChar = idElDOM.charAt(0);
            if (firstChar != '_')
                idElDOM = "_" + idElDOM;
            elDOM = getElDOMByNom(idElDOM);

            elDOM.fD = pFD;

            //_allData.set(elDOM, pFD);
        }
    }
}

//posicionar un element del DOM (fitxa), donades les coordenades del seu FitxaDades.casella associat !!!
function setPosicioElDOM(elDOM, pCasellaDesti) {
    if (typeof elDOM == "string") {
        elDOM = getElDOMByNom(elDOM);
    }
    
    //console.log(elDOM, pCasellaDesti);
    
    if (elDOM) {
        elDOM.style.left = pCasellaDesti.x + "px";
        elDOM.style.top = pCasellaDesti.y + "px";
        elDOM.style.display = "block";
    }
}

function setTipusFitxaElDOM(elDOM, pColor, pTipusFitxa) {
    if (typeof elDOM == "string") {
        elDOM = getElDOMByNom(elDOM);
    }
    if (elDOM) {
        switch (pColor) {
            case COLOR_BLANC:
                switch (pTipusFitxa) {
                    case TIPUS_FITXA_CAVALL:
                        elDOM.src = "../resources/img/CB.PNG";
                        break;
                    case TIPUS_FITXA_ALFIL:
                        elDOM.src = "../resources/img/AB.PNG";
                        break;
                    case TIPUS_FITXA_TORRE:
                        elDOM.src = "../resources/img/TB.PNG";
                        break;
                    case TIPUS_FITXA_DAMA:
                        elDOM.src = "../resources/img/DB.PNG";
                        break;
                }
                break;
            case COLOR_NEGRE:
                switch (pTipusFitxa) {
                    case TIPUS_FITXA_CAVALL:
                        elDOM.src = "../resources/img/CN.PNG";
                        break;
                    case TIPUS_FITXA_ALFIL:
                        elDOM.src = "../resources/img/AN.PNG";
                        break;
                    case TIPUS_FITXA_TORRE:
                        elDOM.src = "../resources/img/TN.PNG";
                        break;
                    case TIPUS_FITXA_DAMA:
                        elDOM.src = "../resources/img/DN.PNG";
                        break;
                }
                break;
        }
    }
}

//FitxaDades: constructor
function FitxaDades(pCmd, pNom, pTipusFitxa, pColor, pColorBottomTauler, pIsMoved, pIiJ, pIsTwoForward, pIsLastMove) {
    this.cmd = pCmd;
    this.nom = pNom;
    this.tipusFitxa = pTipusFitxa;
    this.color = pColor;
    this.colorBottomTauler = pColorBottomTauler;
    this.isMoved = pIsMoved;
    this.iiJ = pIiJ;
    this.isTwoForward = pIsTwoForward;
    this.isLastMove = pIsLastMove;
};

//FitxaDades: getters i setters
FitxaDades.prototype = {
    //cmd: si la fitxa es troba a arrayTauler o _arrayTauler
    get cmd() {
        return this._cmd;
    },
    set cmd(val) {
        this._cmd = val;
    },
    //nom: nom de la fitxa
    get nom() {
        return this._nom;
    },
    set nom(val) {
        this._nom = val;
    },
    //tipusFitxa: si és rei, dama, torre, àlfil, cavall o peó
    get tipusFitxa() {
        return this._tipusFitxa;
    },
    set tipusFitxa(val) {
        this._tipusFitxa = val;
    },
    //color: si és blanc o negre
    get color() {
        return this._color;
    },
    set color(val) {
        this._color = val;
    },
    //colorBottomTauler: si és blanc o negre el color que estigui a sota del tauler
    get colorBottomTauler() {
        return this._colorBottomTauler;
    },
    set colorBottomTauler(val) {
        this._colorBottomTauler = val;
    },
    //isMoved: si la fitxa s'ha mogut
    get isMoved() {
        return this._isMoved;
    },
    set isMoved(val) {
        this._isMoved = val;
    },
    //iiJ: coordenades col-fil dins arrayTauler (TAULER_REAL) o _arrayTauler (TAULER_VIRTUAL)
    get iiJ() {
        if (!this._cmd || this._cmd === "" || this._cmd === TAULER_REAL) {
            return this._iiJArray;
        } else if (this._cmd === TAULER_VIRTUAL) {
            if (!this._iiJ_Array) {
                return this._iiJArray;
            } else {
                return this._iiJ_Array;
            }
        }
    },
    set iiJ(val) {
        var iiJDesti = null;
        var xiYDesti = null;
        if ((val instanceof Point) === true) {
            xiYDesti = val;
            iiJDesti = obtenirIiJDePointCasella(this._colorBottomTauler/*param_colorUsuari*/, xiYDesti);
        } else if ((val instanceof ElMeuPoint) === true) {
            iiJDesti = val;
            xiYDesti = obtenirPointCasellaDeIiJ(iiJDesti.i, iiJDesti.j, this._colorBottomTauler/*param_colorUsuari*/);
        }
        if (!this._cmd || this._cmd === "" || this._cmd === TAULER_REAL) {
            if (this._iiJArray) {
                arrayTauler[this._iiJArray.i][this._iiJArray.j] = "";
            }
            this._iiJArray = iiJDesti;
            //mirem si a la casella destí hi tenim una peça, si és així, ens la mengem!!!
            var fitxaACasellaDesti = arrayTauler[iiJDesti.i][iiJDesti.j];
            if (fitxaACasellaDesti && fitxaACasellaDesti !== "") {
                document.getElementById(fitxaACasellaDesti).style.display = "none";
            }
            arrayTauler[iiJDesti.i][iiJDesti.j] = this._nom;
            setPosicioElDOM(this._nom, xiYDesti);
            //this._isMoved = true;
        } else if (this._cmd === TAULER_VIRTUAL) {
            if (this._iiJ_Array) {
                _arrayTauler[this._iiJ_Array.i][this._iiJ_Array.j] = "";
            }
            this._iiJ_Array = iiJDesti;
            _arrayTauler[iiJDesti.i][iiJDesti.j] = this._nom;
        }
    },
    //isTwoForward només es fa servir pels peons (si han avançat 2 caselles endavant)
    get isTwoForward() {
        return this._isTwoForward;
    },
    set isTwoForward(val) {
        this._isTwoForward = val;
    },
    //isLastMove
    get isLastMove() {
        return this._isLastMove;
    },
    set isLastMove(val) {
        this._isLastMove = val;
    }
};

//**************************************************************************
//** INI POSICIO FITXA *****************************************************
//**************************************************************************
/*function getPosicioFitxa(pCmd, pFitxaNom) {
 var result = null;
 var arrayT = commutatorArrayT(pCmd);
 var bTrobat = false;
 var i = 0;
 
 while (i < arrayT.length && bTrobat === false) {
 var j = 0;
 while (j < arrayT[i].length && bTrobat === false) {
 var fitxaNom = arrayT[i][j];
 if (fitxaNom && fitxaNom !== "") {
 var fD = getFitxaDadesFromElDOM(fitxaNom);
 if (fD.nom === pFitxaNom) {
 result = new ElMeuPoint(i, j);
 bTrobat = true;
 }
 }
 j++;
 }
 i++;
 }
 return result;
 }*/

/*
 function setPosicioFitxa(pCmd, pFitxaNom, pCoordsDesti, pParam_colorUsuari) {
 
 if (!pCoordsDesti) return; 
 
 if ((pCoordsDesti instanceof Point) === false && (pCoordsDesti instanceof ElMeuPoint) === false) return;
 
 var iiJDesti = null;
 var xiYDesti = null;
 
 if ((pCoordsDesti instanceof Point) === true) {
 xiYDesti = pCoordsDesti;
 iiJDesti = obtenirIiJDePointCasella(pParam_colorUsuari, xiYDesti);
 } else if ((pCoordsDesti instanceof ElMeuPoint) === true) {
 iiJDesti = pCoordsDesti;
 xiYDesti = obtenirPointCasellaDeIiJ(iiJDesti.i, iiJDesti.j, pParam_colorUsuari);
 }
 
 var fD = getFitxaDadesFromElDOM(pFitxaNom);
 fD.iiJ = iiJDesti;
 
 //1) posicionem internament la fitxa al tauler
 //var arrayT = commutatorArrayT(pCmd);
 //1.a) treiem la Fitxa de la casella origen
 //var iiJOrigen = getPosicioFitxa(pCmd, pFitxaNom);
 
 //if (iiJOrigen !== null) {
 //arrayT[iiJOrigen.i][iiJOrigen.j] = "";
 //}
 
 
 //1.b) posem la Fitxa a la casella destí
 //arrayT[iiJDesti.i][iiJDesti.j] = pFitxaNom;
 //2) posicionem gràficament la fitxa al tauler, si es tracta de pCmd == TAULER_REAL
 if (pCmd === TAULER_REAL) {
 var f = getElDOMByNom(pFitxaNom);
 setPosicioElDOM(f, xiYDesti);
 }
 }
 */

/*function setPosicioFitxa(pCmd, pFitxaNom, pIiJInArray, pParam_colorUsuari) {
 var f = getElDOMByNom(pFitxaNom);
 var fD = getFitxaDadesFromElDOM(f);
 var arrayT = commutatorArrayT(pCmd);
 fD.iiJInArray = pIiJInArray;
 //treiem la Fitxa de la casella origen
 arrayT[fD.iiJInArray.i][fD.iiJInArray.j] = "";
 fD.casella = obtenirPointCasellaDeIiJ(fD.iiJInArray.i, fD.iiJInArray.j, pParam_colorUsuari);
 setPosicioElDOM(f);
 fD.isMoved = true;
 //posem la Fitxa a la casella destí
 arrayT[fD.iiJInArray.i][fD.iiJInArray.j] = pFitxaNom;
 setFitxaDadesToElDOM(f, fD);
 }*/
//**************************************************************************
//** FIN POSICIO FITXA *****************************************************
//**************************************************************************

function checkColorInEstelaByIiJ(pCmd, color, col, fil) {
    var arrayE = commutatorArrayE(pCmd);
    var bColorInEstela = false;
    var listEsteles = arrayE[col][fil];
    var idx = 0;
    while (idx < listEsteles.length && bColorInEstela === false) {
        var sEstela = listEsteles[idx];
        bColorInEstela = (sEstela.indexOf(color) !== -1 && sEstela.indexOf("@") === -1);
        idx++;
    }
    return bColorInEstela;
}

function commutatorArrayT(pCmd) {
    var arrayT = null;
    switch (pCmd) {
        case TAULER_VIRTUAL:
            arrayT = _arrayTauler;
            break;
        case TAULER_REAL:
            arrayT = arrayTauler;
            break;
    }
    return arrayT;
}

function commutatorArrayE(pCmd) {
    var arrayE = null;
    switch (pCmd) {
        case TAULER_VIRTUAL:
            arrayE = _arrayEsteles;
            break;
        case TAULER_REAL:
            arrayE = arrayEsteles;
            break;
    }
    return arrayE;
}

/*function addFitxaInArrayTauler(pCmd, pFitxaNom) {
 var fD = getFitxaDadesFromElDOM(pFitxaNom);
 var arrayT = commutatorArrayT(pCmd);
 arrayT[fD.iiJInArray.i][fD.iiJInArray.j] = pFitxaNom;
 }*/

function addEstelaInArrayEsteles(pCmd, pFitxaNom, pCol, pFil) {
    var arrayE = commutatorArrayE(pCmd);
    arrayE[pCol][pFil].push(pFitxaNom);
}

function initializeTaulerInSala(colorBottom) {
    initializeArrayTauler(true);
    addFitxesInArrayTauler(colorBottom, true);
    initializeArrayEsteles();
    synchronizeEsteles();
}
function initializeTaulerInVeurePartida(colorBottom) 
{
    initializeArrayTauler(false);
    addFitxesInArrayTauler(colorBottom, false);
    /*
    //BLANQUES
    setPosicioElDOM("TB1", obtenirPointCasella(colorBottom, CASELLA_A1_B));
    setPosicioElDOM("CB1", obtenirPointCasella(colorBottom, CASELLA_B1_B));
    setPosicioElDOM("AB1", obtenirPointCasella(colorBottom, CASELLA_C1_B));
    setPosicioElDOM("DB1", obtenirPointCasella(colorBottom, CASELLA_D1_B));
    setPosicioElDOM("RB1", obtenirPointCasella(colorBottom, CASELLA_E1_B));
    setPosicioElDOM("AB2", obtenirPointCasella(colorBottom, CASELLA_F1_B));
    setPosicioElDOM("CB2", obtenirPointCasella(colorBottom, CASELLA_G1_B));
    setPosicioElDOM("TB2", obtenirPointCasella(colorBottom, CASELLA_H1_B));
    setPosicioElDOM("PB1", obtenirPointCasella(colorBottom, CASELLA_A2_B));
    setPosicioElDOM("PB2", obtenirPointCasella(colorBottom, CASELLA_B2_B));
    setPosicioElDOM("PB3", obtenirPointCasella(colorBottom, CASELLA_C2_B));
    setPosicioElDOM("PB4", obtenirPointCasella(colorBottom, CASELLA_D2_B));
    setPosicioElDOM("PB5", obtenirPointCasella(colorBottom, CASELLA_E2_B));
    setPosicioElDOM("PB6", obtenirPointCasella(colorBottom, CASELLA_F2_B));
    setPosicioElDOM("PB7", obtenirPointCasella(colorBottom, CASELLA_G2_B));
    setPosicioElDOM("PB8", obtenirPointCasella(colorBottom, CASELLA_H2_B));
    //NEGRES
    setPosicioElDOM("TN1", obtenirPointCasella(colorBottom, CASELLA_A8_B));
    setPosicioElDOM("CN1", obtenirPointCasella(colorBottom, CASELLA_B8_B));
    setPosicioElDOM("AN1", obtenirPointCasella(colorBottom, CASELLA_C8_B));
    setPosicioElDOM("DN1", obtenirPointCasella(colorBottom, CASELLA_D8_B));
    setPosicioElDOM("RN1", obtenirPointCasella(colorBottom, CASELLA_E8_B));
    setPosicioElDOM("AN2", obtenirPointCasella(colorBottom, CASELLA_F8_B));
    setPosicioElDOM("CN2", obtenirPointCasella(colorBottom, CASELLA_G8_B));
    setPosicioElDOM("TN2", obtenirPointCasella(colorBottom, CASELLA_H8_B));
    setPosicioElDOM("PN1", obtenirPointCasella(colorBottom, CASELLA_A7_B));
    setPosicioElDOM("PN2", obtenirPointCasella(colorBottom, CASELLA_B7_B));
    setPosicioElDOM("PN3", obtenirPointCasella(colorBottom, CASELLA_C7_B));
    setPosicioElDOM("PN4", obtenirPointCasella(colorBottom, CASELLA_D7_B));
    setPosicioElDOM("PN5", obtenirPointCasella(colorBottom, CASELLA_E7_B));
    setPosicioElDOM("PN6", obtenirPointCasella(colorBottom, CASELLA_F7_B));
    setPosicioElDOM("PN7", obtenirPointCasella(colorBottom, CASELLA_G7_B));
    setPosicioElDOM("PN8", obtenirPointCasella(colorBottom, CASELLA_H7_B));
    */
}

function initializeArrayTauler(withHidden) {
    //inicialitzem les arrays tauler
    arrayTauler.splice(0, arrayTauler.length);
    if (withHidden) {
        _arrayTauler.splice(0, _arrayTauler.length);
    }
    arrayTauler = create2DArray(NUM_FILES, NUM_COLUMNES, null);
    if (withHidden) {
        _arrayTauler = create2DArray(NUM_FILES, NUM_COLUMNES, null);
    }
}

function initializeArrayEsteles() {
    arrayEsteles = create3DArray(NUM_FILES, NUM_COLUMNES, 0, null);
    _arrayEsteles = create3DArray(NUM_FILES, NUM_COLUMNES, 0, null);
}

function addFitxesInArrayTauler(colorBottom, withHidden) {

    //el param. colorBottom és el mateix que param_colorUsuari!!!

    //////////////////// PECES BLANQUES ////////////////////////////////////
    //Ta1
    setFitxaDadesToElDOM(TAULER_REAL, "TB1", new FitxaDades(TAULER_REAL, "TB1", TIPUS_FITXA_TORRE, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_A1_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_TB1", new FitxaDades(TAULER_VIRTUAL, "_TB1", TIPUS_FITXA_TORRE, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_A1_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "TB1", CASELLA_A1_B, colorUsuari);

    //Cb1
    setFitxaDadesToElDOM(TAULER_REAL, "CB1", new FitxaDades(TAULER_REAL, "CB1", TIPUS_FITXA_CAVALL, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_B1_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_CB1", new FitxaDades(TAULER_VIRTUAL, "_CB1", TIPUS_FITXA_CAVALL, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_B1_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "CB1", CASELLA_B1_B, colorUsuari);

    //Ac1
    setFitxaDadesToElDOM(TAULER_REAL, "AB1", new FitxaDades(TAULER_REAL, "AB1", TIPUS_FITXA_ALFIL, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_C1_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_AB1", new FitxaDades(TAULER_VIRTUAL, "_AB1", TIPUS_FITXA_ALFIL, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_C1_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "AB1", CASELLA_C1_B, colorUsuari);

    //Dd1
    setFitxaDadesToElDOM(TAULER_REAL, "DB1", new FitxaDades(TAULER_REAL, "DB1", TIPUS_FITXA_DAMA, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_D1_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_DB1", new FitxaDades(TAULER_VIRTUAL, "_DB1", TIPUS_FITXA_DAMA, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_D1_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "DB", CASELLA_D1_B, colorUsuari);

    //Re1
    setFitxaDadesToElDOM(TAULER_REAL, "RB1", new FitxaDades(TAULER_REAL, "RB1", TIPUS_FITXA_REI, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_E1_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_RB1", new FitxaDades(TAULER_VIRTUAL, "_RB1", TIPUS_FITXA_REI, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_E1_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "RB", CASELLA_E1_B, colorUsuari);

    //Af1
    setFitxaDadesToElDOM(TAULER_REAL, "AB2", new FitxaDades(TAULER_REAL, "AB2", TIPUS_FITXA_ALFIL, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_F1_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_AB2", new FitxaDades(TAULER_VIRTUAL, "_AB2", TIPUS_FITXA_ALFIL, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_F1_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "AB2", CASELLA_F1_B, colorUsuari);

    //Cg1
    setFitxaDadesToElDOM(TAULER_REAL, "CB2", new FitxaDades(TAULER_REAL, "CB2", TIPUS_FITXA_CAVALL, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_G1_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_CB2", new FitxaDades(TAULER_VIRTUAL, "_CB2", TIPUS_FITXA_CAVALL, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_G1_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "CB2", CASELLA_G1_B, colorUsuari);

    //Th1
    setFitxaDadesToElDOM(TAULER_REAL, "TB2", new FitxaDades(TAULER_REAL, "TB2", TIPUS_FITXA_TORRE, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_H1_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_TB2", new FitxaDades(TAULER_VIRTUAL, "_TB2", TIPUS_FITXA_TORRE, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_H1_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "TB2", CASELLA_H1_B, colorUsuari);

    //a2
    setFitxaDadesToElDOM(TAULER_REAL, "PB1", new FitxaDades(TAULER_REAL, "PB1", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_A2_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PB1", new FitxaDades(TAULER_VIRTUAL, "_PB1", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_A2_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PB1", CASELLA_A2_B, colorUsuari);

    //b2
    setFitxaDadesToElDOM(TAULER_REAL, "PB2", new FitxaDades(TAULER_REAL, "PB2", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_B2_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PB2", new FitxaDades(TAULER_VIRTUAL, "_PB2", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_B2_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PB2", CASELLA_B2_B, colorUsuari);

    //c2
    setFitxaDadesToElDOM(TAULER_REAL, "PB3", new FitxaDades(TAULER_REAL, "PB3", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_C2_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PB3", new FitxaDades(TAULER_VIRTUAL, "_PB3", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_C2_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PB3", CASELLA_C2_B, colorUsuari);

    //d2
    setFitxaDadesToElDOM(TAULER_REAL, "PB4", new FitxaDades(TAULER_REAL, "PB4", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_D2_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PB4", new FitxaDades(TAULER_VIRTUAL, "_PB4", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_D2_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PB4", CASELLA_D2_B, colorUsuari);

    //e2
    setFitxaDadesToElDOM(TAULER_REAL, "PB5", new FitxaDades(TAULER_REAL, "PB5", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_E2_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PB5", new FitxaDades(TAULER_VIRTUAL, "_PB5", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_E2_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PB5", CASELLA_E2_B, colorUsuari);

    //f2
    setFitxaDadesToElDOM(TAULER_REAL, "PB6", new FitxaDades(TAULER_REAL, "PB6", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_F2_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PB6", new FitxaDades(TAULER_VIRTUAL, "_PB6", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_F2_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PB6", CASELLA_F2_B, colorUsuari);

    //g2
    setFitxaDadesToElDOM(TAULER_REAL, "PB7", new FitxaDades(TAULER_REAL, "PB7", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_G2_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PB7", new FitxaDades(TAULER_VIRTUAL, "_PB7", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_G2_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PB7", CASELLA_G2_B, colorUsuari);

    //h2
    setFitxaDadesToElDOM(TAULER_REAL, "PB8", new FitxaDades(TAULER_REAL, "PB8", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_H2_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PB8", new FitxaDades(TAULER_VIRTUAL, "_PB8", TIPUS_FITXA_PEO, COLOR_BLANC, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_H2_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PB8", CASELLA_H2_B, colorUsuari);

    //////////////////// PECES NEGRES //////////////////////////////////////
    //Ta8
    setFitxaDadesToElDOM(TAULER_REAL, "TN1", new FitxaDades(TAULER_REAL, "TN1", TIPUS_FITXA_TORRE, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_A8_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_TN1", new FitxaDades(TAULER_VIRTUAL, "_TN1", TIPUS_FITXA_TORRE, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_A8_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "TN1", CASELLA_A8_B, colorUsuari);

    //Cb8
    setFitxaDadesToElDOM(TAULER_REAL, "CN1", new FitxaDades(TAULER_REAL, "CN1", TIPUS_FITXA_CAVALL, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_B8_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_CN1", new FitxaDades(TAULER_VIRTUAL, "_CN1", TIPUS_FITXA_CAVALL, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_B8_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "CN1", CASELLA_B8_B, colorUsuari);

    //Ac8
    setFitxaDadesToElDOM(TAULER_REAL, "AN1", new FitxaDades(TAULER_REAL, "AN1", TIPUS_FITXA_ALFIL, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_C8_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_AN1", new FitxaDades(TAULER_VIRTUAL, "_AN1", TIPUS_FITXA_ALFIL, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_C8_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "AN1", CASELLA_C8_B, colorUsuari);

    //Dd8
    setFitxaDadesToElDOM(TAULER_REAL, "DN1", new FitxaDades(TAULER_REAL, "DN1", TIPUS_FITXA_DAMA, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_D8_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_DN1", new FitxaDades(TAULER_VIRTUAL, "_DN1", TIPUS_FITXA_DAMA, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_D8_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "DN", CASELLA_D8_B, colorUsuari);

    //Re8
    setFitxaDadesToElDOM(TAULER_REAL, "RN1", new FitxaDades(TAULER_REAL, "RN1", TIPUS_FITXA_REI, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_E8_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_RN1", new FitxaDades(TAULER_VIRTUAL, "_RN1", TIPUS_FITXA_REI, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_E8_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "RN", CASELLA_E8_B, colorUsuari);

    //Af8
    setFitxaDadesToElDOM(TAULER_REAL, "AN2", new FitxaDades(TAULER_REAL, "AN2", TIPUS_FITXA_ALFIL, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_F8_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_AN2", new FitxaDades(TAULER_VIRTUAL, "_AN2", TIPUS_FITXA_ALFIL, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_F8_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "AN2", CASELLA_F8_B, colorUsuari);

    //Cg8
    setFitxaDadesToElDOM(TAULER_REAL, "CN2", new FitxaDades(TAULER_REAL, "CN2", TIPUS_FITXA_CAVALL, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_G8_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_CN2", new FitxaDades(TAULER_VIRTUAL, "_CN2", TIPUS_FITXA_CAVALL, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_G8_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "CN2", CASELLA_G8_B, colorUsuari);

    //Th8
    setFitxaDadesToElDOM(TAULER_REAL, "TN2", new FitxaDades(TAULER_REAL, "TN2", TIPUS_FITXA_TORRE, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_H8_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_TN2", new FitxaDades(TAULER_VIRTUAL, "_TN2", TIPUS_FITXA_TORRE, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_H8_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "TN2", CASELLA_H8_B, colorUsuari);

    //a7
    setFitxaDadesToElDOM(TAULER_REAL, "PN1", new FitxaDades(TAULER_REAL, "PN1", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_A7_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PN1", new FitxaDades(TAULER_VIRTUAL, "_PN1", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_A7_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PN1", CASELLA_A7_B, colorUsuari);

    //b7
    setFitxaDadesToElDOM(TAULER_REAL, "PN2", new FitxaDades(TAULER_REAL, "PN2", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_B7_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PN2", new FitxaDades(TAULER_VIRTUAL, "_PN2", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_B7_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PN2", CASELLA_B7_B, colorUsuari);

    //c7
    setFitxaDadesToElDOM(TAULER_REAL, "PN3", new FitxaDades(TAULER_REAL, "PN3", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_C7_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PN3", new FitxaDades(TAULER_VIRTUAL, "_PN3", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_C7_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PN3", CASELLA_C7_B, colorUsuari);

    //d7
    setFitxaDadesToElDOM(TAULER_REAL, "PN4", new FitxaDades(TAULER_REAL, "PN4", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_D7_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PN4", new FitxaDades(TAULER_VIRTUAL, "_PN4", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_D7_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PN4", CASELLA_D7_B, colorUsuari);

    //e7
    setFitxaDadesToElDOM(TAULER_REAL, "PN5", new FitxaDades(TAULER_REAL, "PN5", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_E7_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PN5", new FitxaDades(TAULER_VIRTUAL, "_PN5", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_E7_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PN5", CASELLA_E7_B, colorUsuari);

    //f7
    setFitxaDadesToElDOM(TAULER_REAL, "PN6", new FitxaDades(TAULER_REAL, "PN6", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_F7_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PN6", new FitxaDades(TAULER_VIRTUAL, "_PN6", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_F7_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PN6", CASELLA_F7_B, colorUsuari);

    //g7
    setFitxaDadesToElDOM(TAULER_REAL, "PN7", new FitxaDades(TAULER_REAL, "PN7", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_G7_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PN7", new FitxaDades(TAULER_VIRTUAL, "_PN7", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_G7_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PN7", CASELLA_G7_B, colorUsuari);

    //h7
    setFitxaDadesToElDOM(TAULER_REAL, "PN8", new FitxaDades(TAULER_REAL, "PN8", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_H7_B), false, false));
    if (withHidden) {
        setFitxaDadesToElDOM(TAULER_VIRTUAL, "_PN8", new FitxaDades(TAULER_VIRTUAL, "_PN8", TIPUS_FITXA_PEO, COLOR_NEGRE, colorBottom, false, obtenirPointCasella(colorBottom, CASELLA_H7_B), false, false));
    }
    //setPosicioFitxa(TAULER_REAL, "PN8", CASELLA_H7_B, colorUsuari);



/*
    var colorMov = "B";

    synchronizeEsteles();
*/

}






//**************************************************************************
//** INI MOV'S FITXES AL TAULER ********************************************
//**************************************************************************
function _setEstelaR(pCmd, pFitxaNomFrom, pFitxaNomTo, pCol, pFil) {
    var fDFrom = getFitxaDadesFromElDOM(pCmd, pFitxaNomFrom);
    var fDTo = getFitxaDadesFromElDOM(pCmd, pFitxaNomTo);
    var colorInCheck = fDFrom.color === COLOR_BLANC ? COLOR_NEGRE : COLOR_BLANC;
    if (pFitxaNomTo && pFitxaNomTo !== "") {
        //si trobem una Fitxa de diferent color, i aquesta casella no hi ha estel·la del color contrari, llavors hi posem estel·la
        if (fDFrom.color !== fDTo.color) {
            if (checkColorInEstelaByIiJ(pCmd, colorInCheck, pCol, pFil) === false) {
                addEstelaInArrayEsteles(pCmd, pFitxaNomFrom, pCol, pFil);
            } else {
                //bàsicament posar una estela del color del peó perquè el REI no pugui anar a la casella
                addEstelaInArrayEsteles(pCmd, fDFrom.color, pCol, pFil);
            }
        }
    } else {
        if (checkColorInEstelaByIiJ(pCmd, colorInCheck, pCol, pFil) === false) {
            addEstelaInArrayEsteles(pCmd, pFitxaNomFrom, pCol, pFil);
        } else {
            //bàsicament posar una estela del color del peó perquè el REI no pugui anar a la casella
            addEstelaInArrayEsteles(pCmd, fDFrom.color, pCol, pFil);
        }
    }
}

function setEstelaR(pFD) {
//function setEstelaR(pCmd, pFitxaNomFrom) {
    var cmd = pFD.cmd;
    var arrayE = commutatorArrayE(cmd);
    var arrayT = commutatorArrayT(cmd);
    var fDFrom = pFD;//getFitxaDadesFromElDOM(pCmd, pFitxaNomFrom);
    var iiJ = fDFrom.iiJ;//getPosicioFitxa(pCmd, pFitxaNomFrom);
    var fitxaNomTo = "";
    var i = iiJ.i;//fDFrom.iiJInArray.i;
    var j = iiJ.j;//fDFrom.iiJInArray.j;
    var col, fil;

    //1) fila superior
    col = i - 1;
    fil = j - 1;
    if (col >= 0 && fil >= 0) {
        fitxaNomTo = arrayT[col][fil];
        _setEstelaR(cmd, fDFrom.nom, fitxaNomTo, col, fil);
    }
    //2) fila superior
    col = i;
    fil = j - 1;
    if (fil >= 0) {
        fitxaNomTo = arrayT[col][fil];
        _setEstelaR(cmd, fDFrom.nom, fitxaNomTo, col, fil);
    }
    //3) fila superior
    col = i + 1;
    fil = j - 1;
    if (col <= 7 && fil >= 0) {
        fitxaNomTo = arrayT[col][fil];
        _setEstelaR(cmd, fDFrom.nom, fitxaNomTo, col, fil);
    }
    //4) fila igual
    col = i - 1;
    fil = j;
    if (col >= 0) {
        fitxaNomTo = arrayT[col][fil];
        _setEstelaR(cmd, fDFrom.nom, fitxaNomTo, col, fil);
    }
    //5) fila igual
    col = i + 1;
    fil = j;
    if (col <= 7) {
        fitxaNomTo = arrayT[col][fil];
        _setEstelaR(cmd, fDFrom.nom, fitxaNomTo, col, fil);
    }
    //6) fila inferior
    col = i - 1;
    fil = j + 1;
    if (col >= 0 && fil <= 7) {
        fitxaNomTo = arrayT[col][fil];
        _setEstelaR(cmd, fDFrom.nom, fitxaNomTo, col, fil);
    }
    //7) fila inferior
    col = i;
    fil = j + 1;
    if (fil <= 7) {
        fitxaNomTo = arrayT[col][fil];
        _setEstelaR(cmd, fDFrom.nom, fitxaNomTo, col, fil);
    }
    //8) fila inferior
    col = i + 1;
    fil = j + 1;
    if (col <= 7 && fil <= 7) {
        fitxaNomTo = arrayT[col][fil];
        _setEstelaR(cmd, fDFrom.nom, fitxaNomTo, col, fil);
    }
    //9) possibilitat d'enrocar curt????
    if (esPossibleEnrocarCurt(cmd, fDFrom.nom) == true) {
        switch (fDFrom.color) {
            case COLOR_BLANC:
            {
                addEstelaInArrayEsteles(cmd, "@" + fDFrom.nom, 6, 7);
                break;
            }
            case COLOR_NEGRE:
            {
                addEstelaInArrayEsteles(cmd, "@" + fDFrom.nom, 6, 0);
                break;
            }
        }
    }
    //10) possibilitat d'enrocar llarg????
    if (esPossibleEnrocarLlarg(cmd, fDFrom.nom) == true) {
        switch (fDFrom.color) {
            case COLOR_BLANC:
            {
                addEstelaInArrayEsteles(cmd, "@" + fDFrom.nom, 2, 7);
                break;
            }
            case COLOR_NEGRE:
            {
                addEstelaInArrayEsteles(cmd, "@" + fDFrom.nom, 2, 0);
                break;
            }
        }
    }
}

function setEstelaD(pFD) {
//function setEstelaD(pCmd, pFitxaNomFrom) {
    setEstelaA(pFD);
    setEstelaT(pFD);
    //setEstelaA(pCmd, pFitxaNomFrom);
    //setEstelaT(pCmd, pFitxaNomFrom);
}

function setEstelaA(pFD) {
//function setEstelaA(pCmd, pFitxaNomFrom) {
    var cmd = pFD.cmd;
    var arrayT = commutatorArrayT(cmd);
    var fDFrom = pFD;//getFitxaDadesFromElDOM(pCmd, pFitxaNomFrom);
    var iiJ = fDFrom.iiJ;//getPosicioFitxa(pCmd, pFitxaNomFrom);
    var fitxaNomTo = "";
    var fDTo = null;
    var col = iiJ.i;//fDFrom.iiJInArray.i;
    var fil = iiJ.j;//fDFrom.iiJInArray.j;
    var bParar = false;
    //1) fila superior 
    while (col > 0 && fil > 0 && bParar === false) {
        col--;
        fil--;
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        bParar = doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);

    }
    //2) fila superior 
    col = iiJ.i;//fDFrom.iiJInArray.i;
    fil = iiJ.j;//fDFrom.iiJInArray.j;
    bParar = false;
    while (col < 7 && fil > 0 && bParar === false) {
        col++;
        fil--;
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        bParar = doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
    //3) fila inferior 
    col = iiJ.i;//fDFrom.iiJInArray.i;
    fil = iiJ.j;//fDFrom.iiJInArray.j;
    bParar = false;
    while (col > 0 && fil < 7 && bParar === false) {
        col--;
        fil++;
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        bParar = doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
    //4) fila inferior 
    col = iiJ.i;//fDFrom.iiJInArray.i;
    fil = iiJ.j;//fDFrom.iiJInArray.j;
    bParar = false;
    while (col < 7 && fil < 7 && bParar === false) {
        col++;
        fil++;
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        bParar = doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
}

function setEstelaC(pFD) {
//function setEstelaC(pCmd, pFitxaNomFrom) {
    var cmd = pFD.cmd;
    var arrayT = commutatorArrayT(cmd);
    var fDFrom = pFD;//getFitxaDadesFromElDOM(pCmd, pFitxaNomFrom);
    var iiJ = fDFrom.iiJ;//getPosicioFitxa(pCmd, pFitxaNomFrom);
    var fitxaNomTo = "";
    var fDTo = null;
    //columna - 2
    var col = iiJ.i - 2;//fDFrom.iiJInArray.i - 2;
    var fil = iiJ.j - 1;//fDFrom.iiJInArray.j - 1;
    if (col >= 0 && fil >= 0) {
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
    //columna - 2
    col = iiJ.i - 2;//fDFrom.iiJInArray.i - 2;
    fil = iiJ.j + 1;//fDFrom.iiJInArray.j + 1;
    if (col >= 0 && fil <= 7) {
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
    //columna - 1
    col = iiJ.i - 1;//fDFrom.iiJInArray.i - 1;
    fil = iiJ.j - 2;//fDFrom.iiJInArray.j - 2;
    if (col >= 0 && fil >= 0) {
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
    //columna - 1
    col = iiJ.i - 1;//fDFrom.iiJInArray.i - 1;
    fil = iiJ.j + 2;//fDFrom.iiJInArray.j + 2;
    if (col >= 0 && fil <= 7) {
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
    //columna + 1
    col = iiJ.i + 1;//fDFrom.iiJInArray.i + 1;
    fil = iiJ.j - 2;//fDFrom.iiJInArray.j - 2;
    if (col <= 7 && fil >= 0) {
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
    //columna + 1
    col = iiJ.i + 1;//fDFrom.iiJInArray.i + 1;
    fil = iiJ.j + 2;//fDFrom.iiJInArray.j + 2;
    if (col <= 7 && fil <= 7) {
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
    //columna + 2
    col = iiJ.i + 2;//fDFrom.iiJInArray.i + 2;
    fil = iiJ.j - 1;//fDFrom.iiJInArray.j - 1;
    if (col <= 7 && fil >= 0) {
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
    //columna + 2
    col = iiJ.i + 2;//fDFrom.iiJInArray.i + 2;
    fil = iiJ.j + 1;//fDFrom.iiJInArray.j + 1;
    if (col <= 7 && fil <= 7) {
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
}

function setEstelaT(pFD) {
//function setEstelaT(pCmd, pFitxaNomFrom) {
    var cmd = pFD.cmd;
    var arrayT = commutatorArrayT(cmd);
    var fDFrom = pFD;//getFitxaDadesFromElDOM(pCmd, pFitxaNomFrom);
    var iiJ = fDFrom.iiJ;//getPosicioFitxa(pCmd, pFitxaNomFrom);
    var fitxaNomTo = "";
    var fDTo = null;
    //1) fila superior 
    var col = iiJ.i;//fDFrom.iiJInArray.i;
    var fil = iiJ.j;//fDFrom.iiJInArray.j;
    var bParar = false;
    while (fil > 0 && bParar === false) {
        fil--;
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        bParar = doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
    //2) fila igual 
    col = iiJ.i;//fDFrom.iiJInArray.i;
    fil = iiJ.j;//fDFrom.iiJInArray.j;
    bParar = false;
    while (col > 0 && bParar === false) {
        col--;
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        bParar = doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
    //3) fila igual 
    col = iiJ.i;//fDFrom.iiJInArray.i;
    fil = iiJ.j;//fDFrom.iiJInArray.j;
    bParar = false;
    while (col < 7 && bParar === false) {
        col++;
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        bParar = doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
    //4) fila inferior 
    col = iiJ.i;//fDFrom.iiJInArray.i;
    fil = iiJ.j;//fDFrom.iiJInArray.j;
    bParar = false;
    while (fil < 7 && bParar === false) {
        fil++;
        fitxaNomTo = arrayT[col][fil];
        fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
        //si hi ha fitxa en la casella actual, llavors parem estel·la
        bParar = doIsOKAddEstela(cmd, fDFrom, fDTo, col, fil);
    }
}

function setEstelaP(pFD) {
//function setEstelaP(pCmd, pFitxaNomFrom) {
    var cmd = pFD.cmd;
    var arrayT = commutatorArrayT(cmd);
    var fDFrom = pFD;//getFitxaDadesFromElDOM(pCmd, pFitxaNomFrom);
    var iiJ = fDFrom.iiJ;//getPosicioFitxa(pCmd, pFitxaNomFrom);

    var fitxaNomTo = "";
    var fDTo = null;
    var i = iiJ.i;//fDFrom.iiJInArray.i;
    var j = iiJ.j;//fDFrom.iiJInArray.j;
    var col, fil;

    switch (fDFrom.color) {
        case COLOR_BLANC:
            //estel·la captura: columna esquerra
            col = i - 1;
            fil = j - 1;
            if (col >= 0 && fil >= 0) {
                fitxaNomTo = arrayT[col][fil];
                fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
                if (fitxaNomTo && fitxaNomTo !== "" && fDTo.color !== fDFrom.color) {
                    addEstelaInArrayEsteles(cmd, fDFrom.nom, col, fil);
                } else {
                    //bàsicament posar una estela del color del peó perquè el REI no pugui anar a la casella
                    addEstelaInArrayEsteles(cmd, fDFrom.color, col, fil);
                }
            }
            //estel·la captura: columna dreta
            col = i + 1;
            fil = j - 1;
            if (col <= 7 && fil >= 0) {
                fitxaNomTo = arrayT[col][fil];
                fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
                if (fitxaNomTo && fitxaNomTo !== "" && fDTo.color !== fDFrom.color) {
                    addEstelaInArrayEsteles(cmd, fDFrom.nom, col, fil);
                } else {
                    //bàsicament posar una estela del color del peó perquè el REI no pugui anar a la casella
                    addEstelaInArrayEsteles(cmd, fDFrom.color, col, fil);
                }
            }
            //moviments endavant
            //cas 1) el mov. de sempre
            col = i;
            fil = j - 1;
            if (fil >= 0) {
                fitxaNomTo = arrayT[col][fil];
                //si no tenim cap peça una casella endavant, llavors es pot avançar
                if (!fitxaNomTo || fitxaNomTo === "") {
                    addEstelaInArrayEsteles(cmd, "@" + fDFrom.nom, col, fil);
                    //cas 2) el mov. partint de la casella inicial (2 caselles endavant)
                    if (j == 6) {
                        col = i;
                        fil = j - 2;
                        fitxaNomTo = arrayT[col][fil];
                        if (!fitxaNomTo || fitxaNomTo === "") {
                            addEstelaInArrayEsteles(cmd, "@" + fDFrom.nom, col, fil);
                        }
                    }
                }
            }
            var arrEsPossibleCapturarAlPas = esPossibleCapturarAlPas(cmd, fDFrom.nom);
            arrEsPossibleCapturarAlPas = arrEsPossibleCapturarAlPas.split("|");
            //comprovem si és possible menjar al pas per l'esquerra
            if (arrEsPossibleCapturarAlPas.length === 2 && arrEsPossibleCapturarAlPas[0] === "ESQUERRA") {
                col = i - 1;
                fil = 2;
                if (col >= 0) {
                    addEstelaInArrayEsteles(cmd, fDFrom.nom, col, fil);
                }
            } else
            //comprovem si és possible menjar al pas per la dreta
            if (arrEsPossibleCapturarAlPas.length === 2 && arrEsPossibleCapturarAlPas[0] === "DRETA") {
                col = i + 1;
                fil = 2;
                if (col <= 7) {
                    addEstelaInArrayEsteles(cmd, fDFrom.nom, col, fil);
                }
            }
            break;
        case COLOR_NEGRE:
            //estel·la captura: columna esquerra
            col = i - 1;
            fil = j + 1;
            if (col >= 0 && fil <= 7) {
                fitxaNomTo = arrayT[col][fil];
                fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
                if (fitxaNomTo && fitxaNomTo !== "" && fDTo.color !== fDFrom.color) {
                    addEstelaInArrayEsteles(cmd, fDFrom.nom, col, fil);
                } else {
                    //bàsicament posar una estela del color del peó perquè el REI no pugui anar a la casella
                    addEstelaInArrayEsteles(cmd, fDFrom.color, col, fil);
                }
            }
            //estel·la captura: columna dreta
            col = i + 1;
            fil = j + 1;
            if (col <= 7 && fil <= 7) {
                fitxaNomTo = arrayT[col][fil];
                fDTo = getFitxaDadesFromElDOM(cmd, fitxaNomTo);
                if (fitxaNomTo && fitxaNomTo !== "" && fDTo.color !== fDFrom.color) {
                    addEstelaInArrayEsteles(cmd, fDFrom.nom, col, fil);
                } else {
                    //bàsicament posar una estela del color del peó perquè el REI no pugui anar a la casella
                    addEstelaInArrayEsteles(cmd, fDFrom.color, col, fil);
                }
            }
            //moviments endavant
            //cas 1) el mov. de sempre
            col = i;
            fil = j + 1;
            if (fil <= 7) {
                fitxaNomTo = arrayT[col][fil];
                //si no tenim cap peça una casella endavant, llavors es pot avançar
                if (!fitxaNomTo || fitxaNomTo === "") {
                    addEstelaInArrayEsteles(cmd, "@" + fDFrom.nom, col, fil);
                    //cas 2) el mov. partint de la casella inicial (2 caselles endavant)
                    if (j == 1) {
                        col = i;
                        fil = j + 2;
                        fitxaNomTo = arrayT[col][fil];
                        if (!fitxaNomTo || fitxaNomTo === "") {
                            addEstelaInArrayEsteles(cmd, "@" + fDFrom.nom, col, fil);
                        }
                    }
                }
            }
            var arrEsPossibleCapturarAlPas = esPossibleCapturarAlPas(cmd, fDFrom.nom);
            arrEsPossibleCapturarAlPas = arrEsPossibleCapturarAlPas.split("|");
            //comprovem si és possible menjar al pas per l'esquerra
            if (arrEsPossibleCapturarAlPas.length === 2 && arrEsPossibleCapturarAlPas[0] === "ESQUERRA") {
                col = i - 1;
                fil = 5;
                if (col >= 0) {
                    addEstelaInArrayEsteles(cmd, fDFrom.nom, col, fil);
                }
            } else
            //comprovem si és possible menjar al pas per la dreta
            if (arrEsPossibleCapturarAlPas.length === 2 && arrEsPossibleCapturarAlPas[0] === "DRETA") {
                col = i + 1;
                fil = 5;
                if (col <= 7) {
                    addEstelaInArrayEsteles(cmd, fDFrom.nom, col, fil);
                }
            }
            break;
    }

}

 

function coronacio(pFD, pTipusFitxaAConvertir) {
    var fDBeforeChange = new FitxaDades(pFD.cmd, pFD.nom, pFD.tipusFitxa, pFD.color, pFD.colorBottomTauler, true, pFD.iiJ, false, true);
    var fDAfterChange = new FitxaDades(pFD.cmd, pFD.nom, pFD.tipusFitxa, pFD.color, pFD.colorBottomTauler, true, pFD.iiJ, false, true);
    var countFitxesByTipusIColor = getCountFitxesByTipusIColor(pTipusFitxaAConvertir, pFD.color)+'';
    fDAfterChange.nom = pTipusFitxaAConvertir + pFD.color + countFitxesByTipusIColor;
    fDAfterChange.tipusFitxa = pTipusFitxaAConvertir;
    var elDOM = getElDOMByNom(fDBeforeChange.nom);
    elDOM.id = fDAfterChange.nom;
    setTipusFitxaElDOM(elDOM.id, pFD.color, pTipusFitxaAConvertir);
    setFitxaDadesToElDOM(TAULER_REAL, fDAfterChange.nom, fDAfterChange);
}

function getCountFitxesByTipusIColor(pTipusFitxa, pColor) {
    //inicialitzem el comptador a 3, qualsevol nombre superior a 2!!!
    var counter = 3;
    //files
    for (var j = 0; j < 8; j++) {
        //columnes
        for (var i = 0; i < 8; i++) {
            var fitxaNom = arrayTauler[i][j];
            if (fitxaNom && fitxaNom.indexOf(pTipusFitxa+pColor) != -1) {
                counter++;
            } 
        }
    }
    return counter;
}

function getElDOMByNom(pFitxaNom) {
    var elDOM = null;
    if (pFitxaNom !== "") {
        elDOM = document.getElementById(pFitxaNom);
    }
    return elDOM;
}

function enrocarCurt(pCmd, pColor) {
    var arrayT = commutatorArrayT(pCmd);
    var iiJ; //ElMeuPoint
    switch (pColor) {
        case COLOR_BLANC:
        {
            var fD_RB1 = getFitxaDadesFromElDOM(pCmd, "RB1");
            fD_RB1.iiJ = new ElMeuPoint(6, 7);
            setFitxaDadesToElDOM(pCmd, "RB1", fD_RB1);
            //setPosicioFitxa(pCmd, "RB1", iiJ, param_colorUsuari);
            var fD_TB2 = getFitxaDadesFromElDOM(pCmd, "TB2");
            fD_TB2.iiJ = new ElMeuPoint(5, 7);
            setFitxaDadesToElDOM(pCmd, "TB2", fD_TB2);
            //setPosicioFitxa(pCmd, "TB2", iiJ, param_colorUsuari);
            break;
        }
        case COLOR_NEGRE:
        {
            var fD_RN1 = getFitxaDadesFromElDOM(pCmd, "RN1");
            fD_RN1.iiJ = new ElMeuPoint(6, 0);
            setFitxaDadesToElDOM(pCmd, "RN1", fD_RN1);
            //setPosicioFitxa(pCmd, "RN", iiJ, param_colorUsuari);
            var fD_TN2 = getFitxaDadesFromElDOM(pCmd, "TN2");
            fD_TN2.iiJ = new ElMeuPoint(5, 0);
            setFitxaDadesToElDOM(pCmd, "TN2", fD_TN2);
            //setPosicioFitxa(pCmd, "TN2", iiJ, param_colorUsuari);
            break;
        }
    }
}

function enrocarLlarg(pCmd, pColor) {
    var arrayT = commutatorArrayT(pCmd);
    var iiJ; //ElMeuPoint
    switch (pColor) {
        case COLOR_BLANC:
        {
            var fD_RB1 = getFitxaDadesFromElDOM(pCmd, "RB1");
            fD_RB1.iiJ = new ElMeuPoint(2, 7);
            setFitxaDadesToElDOM(pCmd, "RB1", fD_RB1);
            //setPosicioFitxa(pCmd, "RB", iiJ, param_colorUsuari);
            var fD_TB1 = getFitxaDadesFromElDOM(pCmd, "TB1");
            fD_TB1.iiJ = new ElMeuPoint(3, 7);
            setFitxaDadesToElDOM(pCmd, "TB1", fD_TB1);
            //setPosicioFitxa(pCmd, "TB1", iiJ, param_colorUsuari);
            break;
        }
        case COLOR_NEGRE:
        {
            var fD_RN1 = getFitxaDadesFromElDOM(pCmd, "RN1");
            fD_RN1.iiJ = new ElMeuPoint(2, 0);
            setFitxaDadesToElDOM(pCmd, "RN1", fD_RN1);
            //setPosicioFitxa(pCmd, "RN", iiJ, param_colorUsuari);
            var fD_TN1 = getFitxaDadesFromElDOM(pCmd, "TN1");
            fD_TN1.iiJ = new ElMeuPoint(3, 0);
            setFitxaDadesToElDOM(pCmd, "TN1", fD_TN1);
            //setPosicioFitxa(pCmd, "TN1", iiJ, param_colorUsuari);
            break;
        }
    }
}

function capturarAlPas(pCmd, pFitxaNomFrom, pIiJ, pFitxaNomACapturarAlPas) {
    var arrayT = commutatorArrayT(pCmd);
    var fDFrom = getFitxaDadesFromElDOM(pCmd, pFitxaNomFrom);
    //posicionem el peó a la casella destí
    fDFrom.iiJ = pIiJ;
    setFitxaDadesToElDOM(pCmd, fDFrom.nom, fDFrom);
    var fDFitxaACapturarAlPas = getFitxaDadesFromElDOM(pCmd, pFitxaNomACapturarAlPas);
    //setPosicioFitxa(pCmd, pFitxaNomFrom, iiJ, param_colorUsuari);
    //eliminem el peó menjat al pas
    document.getElementById(pFitxaNomACapturarAlPas).style.display = "none";
    arrayT[fDFitxaACapturarAlPas.iiJ.i][fDFitxaACapturarAlPas.iiJ.j] = "";
}
//**************************************************************************
//** FIN MOV'S FITXES AL TAULER ********************************************
//**************************************************************************


//**************************************************************************
//** INI CHECK MOV'S FITXES AL TAULER **************************************
//**************************************************************************
//comprovem si:
//1) és el torn correcte
//2) la peça s'ha destinat a una casella correcta (nom fitxa apareix a fitxaACasellaDesti)
//3) si no s'ha evitat el Check!
function checkIsOKMove(pFitxaNom, pCasellaDesti) {

    //pCasellaDesti = obtenirPointCasella(param_colorUsuari, pCasellaDesti);

    //synchronizeEsteles();
    copyFromArrayTaulerTo_ArrayTauler();
    setFitxesIEstelesAlTauler(TAULER_VIRTUAL);

    var fD = getFitxaDadesFromElDOM(TAULER_VIRTUAL, pFitxaNom);
    var iiJ = obtenirIiJDePointCasella(param_colorUsuari, pCasellaDesti);
    var bEsColorTornCorrecte = (window.colorTorn === fD.color);
    var bIsOKMove = false;
    if (bEsColorTornCorrecte === true) {
        var l = _arrayEsteles[iiJ.i][iiJ.j];
        var k = 0;
        while (k < l.length && bIsOKMove == false) {
            var s = l[k];
            bIsOKMove = (s === fD.nom || s === "@" + fD.nom);
            k++;
        }
        
        console.log(fD.nom, fD.iiJ, l);
        
        //encara que la Fitxa pugui anar a la casella destí, hem de comprovar que
        //amb aquest moviment no faci una descoberta al seu rei i, que per tant, 
        //no quedi en check!!!
        if (bIsOKMove === true) {

            fD.iiJ = iiJ;

            /*var arrayT = commutatorArrayT(TAULER_VIRTUAL);
             arrayT[fD.iiJ.i][fD.iiJ.j] = "";
             arrayT[iiJ.i][iiJ.j] = pFitxaNom;
             */
            //fD.iiJ.i = iiJ.i;
            //fD.iiJ.j = iiJ.j;

            /*var arrayT = commutatorArrayT(TAULER_VIRTUAL);
             console.log("arrayT[4][6]:",arrayT[4][6]);
             var arrayE = commutatorArrayE(TAULER_VIRTUAL);
             console.log("arrayE[4][6]:",arrayE[4][6]);
             */

            setFitxaDadesToElDOM(TAULER_VIRTUAL, fD.nom, fD);
            //setPosicioFitxa(TAULER_VIRTUAL, pFitxaNom, iiJ, param_colorUsuari);
            setFitxesIEstelesAlTauler(TAULER_VIRTUAL);

            if (checkInCheck(TAULER_VIRTUAL, fD.color) === true) {
                bIsOKMove = false;
                //alert("Estan fent Escac al Rei, evita l'escac");
            }
        }
    }
    return bIsOKMove;
}

function synchronizeEsteles() {
    setFitxesIEstelesAlTauler(TAULER_REAL);
    copyFromArrayTaulerTo_ArrayTauler();
    setFitxesIEstelesAlTauler(TAULER_VIRTUAL);
}

function doIsKOMove() {
    //TODO
}

//si la jugada realitzada és correcta, afegim la jugada a la llista de fitxes mogudes
function doIsOKMove(pFitxaNom, xiYOiiJ, pEnviarRebreJugada, pTempsContrincant) {

    var iiJ;
    if ((xiYOiiJ instanceof Point) === true) {
        iiJ = obtenirIiJDePointCasella(param_colorUsuari, xiYOiiJ);
    } else if ((xiYOiiJ instanceof ElMeuPoint) === true) {
        iiJ = xiYOiiJ;
    }
    
    var isCapturaAlPas = false;
    var isPromotion = false;
    
    var fD = getFitxaDadesFromElDOM(TAULER_REAL, pFitxaNom);
    var jugada = "";
    switch (fD.tipusFitxa) {
        case TIPUS_FITXA_REI:
            switch (fD.color) {
                case COLOR_BLANC:
                    //ENROC CURT: casella origen
                    if (compareObjects(fD.iiJ, new ElMeuPoint(4, 7)) === true
                            &&
                            //ENROC CURT: casella destí
                            compareObjects(iiJ, new ElMeuPoint(6, 7)) === true)
                    {
                        if (esPossibleEnrocarCurt(TAULER_REAL, fD.nom) === true) {
                            enrocarCurt(TAULER_REAL, fD.color);

                            jugada = "O-O";

                        }
                    } else
                    //ENROC LLARG: casella origen
                    if (compareObjects(fD.iiJ, new ElMeuPoint(4, 7)) === true
                            &&
                            //ENROC LLARG: casella destí
                            compareObjects(iiJ, new ElMeuPoint(2, 7)) === true)
                    {
                        if (esPossibleEnrocarLlarg(TAULER_REAL, fD.nom) === true) {
                            enrocarLlarg(TAULER_REAL, fD.color);

                            jugada = "O-O-O";

                        }
                    }
                    break;
                case COLOR_NEGRE:
                    //ENROC CURT: casella origen
                    if (compareObjects(fD.iiJ, new ElMeuPoint(4, 0)) === true
                            &&
                            //ENROC CURT: casella destí
                            compareObjects(iiJ, new ElMeuPoint(6, 0)) === true)
                    {
                        if (esPossibleEnrocarCurt(TAULER_REAL, fD.nom) === true) {
                            enrocarCurt(TAULER_REAL, fD.color);

                            jugada = "O-O";

                        }
                    } else
                    //ENROC LLARG: casella origen
                    if (compareObjects(fD.iiJ, new ElMeuPoint(4, 0)) === true
                            &&
                            //ENROC LLARG: casella destí
                            compareObjects(xiYOiiJ/*xiY*/, new ElMeuPoint(2, 0)) === true)
                    {
                        if (esPossibleEnrocarLlarg(TAULER_REAL, fD.nom) === true) {
                            enrocarLlarg(TAULER_REAL, fD.color);

                            jugada = "O-O-O";

                        }
                    }
                    break;
            }
            break;
        case TIPUS_FITXA_PEO:
            //només mostrar diàleg de coronació si estem enviant la jugada!
            switch (fD.color) {
                case COLOR_BLANC:
                    var arrEsPossibleCapturarAlPas = esPossibleCapturarAlPas(TAULER_REAL, fD.nom);
                    arrEsPossibleCapturarAlPas = arrEsPossibleCapturarAlPas.split("|");
                    if (arrEsPossibleCapturarAlPas.length === 2) {
                        isCapturaAlPas = true;
                        var fitxaNomACapturarAlPas = arrEsPossibleCapturarAlPas[1];
                        capturarAlPas(TAULER_REAL, fD.nom, iiJ, fitxaNomACapturarAlPas);
                    } else if (iiJ.j === 0 && pEnviarRebreJugada === 'enviarjugada') {
                        isPromotion = true;
                        showCoronacioDialog(fD, function() {
                            doIsOKMoveCallback(fD, iiJ, pEnviarRebreJugada, jugada, pTempsContrincant, false);
                        });
                    }
                    break;
                case COLOR_NEGRE:
                    var arrEsPossibleCapturarAlPas = esPossibleCapturarAlPas(TAULER_REAL, fD.nom);
                    arrEsPossibleCapturarAlPas = arrEsPossibleCapturarAlPas.split("|");
                    if (arrEsPossibleCapturarAlPas.length === 2) {
                        isCapturaAlPas = true;
                        var fitxaNomACapturarAlPas = arrEsPossibleCapturarAlPas[1];
                        capturarAlPas(TAULER_REAL, fD.nom, iiJ, fitxaNomACapturarAlPas);
                    } else if (iiJ.j === 7 && pEnviarRebreJugada === 'enviarjugada') {
                        isPromotion = true;
                        showCoronacioDialog(fD, function() {
                            doIsOKMoveCallback(fD, iiJ, pEnviarRebreJugada, jugada, pTempsContrincant, false);
                        });
                    }
                    break;
            }
            break;
    }

    if (isPromotion === false) {
        doIsOKMoveCallback(fD, iiJ, pEnviarRebreJugada, jugada, pTempsContrincant, isCapturaAlPas);
    }

    
    
}

function doIsOKMoveCallback(fD, iiJ, pEnviarRebreJugada, jugada, pTempsContrincant, pCapturarAlPas) {
    
    resetIsLastMoveTaulerReal();
    
    //posició de la fitxa abans de moure
    var pointBefore = new ElMeuPoint(fD.iiJ.i, fD.iiJ.j);
    //posició de la fitxa després de moure
    var pointAfter = new ElMeuPoint(iiJ.i, iiJ.j);
    //actualitzem la posició de la fitxa a la posició destí
    fD.iiJ = iiJ;
    //fD.iiJ = xiYOiiJ;
    fD.isMoved = true;
    fD.isLastMove = true;
    if (fD.tipusFitxa === TIPUS_FITXA_PEO) {
        fD.isTwoForward = (Math.abs(pointBefore.j - pointAfter.j) === 2);
    }
    setFitxaDadesToElDOM(TAULER_REAL, fD.nom, fD);

    synchronizeEsteles();

    if (jugada === "") {
        jugada = "<img src='../resources/img/anotacioJugada/"+fD.tipusFitxa+fD.color+".png' alt='"+fD.tipusFitxa+"'>";
        
        //mirar si hi ha peça contrària a la casella destí
        var sNomPecaACasellaDesti = arrayTauler[iiJ.i][iiJ.j];
        var fDACasellaDesti;
        if (sNomPecaACasellaDesti) {        
            fDACasellaDesti = getFitxaDadesFromElDOM(TAULER_REAL, sNomPecaACasellaDesti);
        }
        
        //indicar que es tracta d'una captura de peça
        if ((fDACasellaDesti && fDACasellaDesti.color !== fD.color) || pCapturarAlPas === true) {
            jugada += "x"; 
        }
        
        switch (iiJ.i) {
            case 0:
                jugada += "a";
                break;
            case 1:
                jugada += "b";
                break;
            case 2:
                jugada += "c";
                break;
            case 3:
                jugada += "d";
                break;
            case 4:
                jugada += "e";
                break;
            case 5:
                jugada += "f";
                break;
            case 6:
                jugada += "g";
                break;
            case 7:
                jugada += "h";
                break;
        }
        switch (iiJ.j) {
            case 0:
                jugada += "8";
                break;
            case 1:
                jugada += "7";
                break;
            case 2:
                jugada += "6";
                break;
            case 3:
                jugada += "5";
                break;
            case 4:
                jugada += "4";
                break;
            case 5:
                jugada += "3";
                break;
            case 6:
                jugada += "2";
                break;
            case 7:
                jugada += "1";
                break;
        }
    }

    var colorInCheck = fD.color === "B" ? "N" : "B";
    var isCheck = checkInCheck(TAULER_REAL, colorInCheck);
    var isCheckMate = checkIfCheckMate(colorInCheck);
    if (isCheckMate === true) {
        jugada += "&#43;&#43;";
    } else if (isCheck === true) {
        jugada += "&#43;";
    }

    if (pCapturarAlPas === true) {
        jugada += '(e.p.)';
    }

    //apunta la jugada a la llista de jugades
    var vJugada = apuntarJugada(fD.color, jugada);

    //activem el control de temps per al contrincant
    startTimer(fD.color, true);
    
    if (pEnviarRebreJugada === 'enviarjugada') {
        
        doCrearJugadesGraella(vJugada);
        
        var elMeuTemps = $("#hiddenTempsBottom").val();
        
        escacsVdtClient.processCommand("doMove" + " " + fD.nom + " " + fD.iiJ.i + " " + fD.iiJ.j + " " + fD.color + " " + elMeuTemps);
        //processUserInput("doMove" + " " + fD.nom + " " + fD.iiJ.i + " " + fD.iiJ.j + " " + fD.color + " " + elMeuTemps, escacsVdtClient, socket);
        
    } else if (pEnviarRebreJugada === 'rebrejugada') {
        
        doCrearPosicioTauler(/*fD,*/ vJugada);
        
        var tempsBefore = +$("#hiddenTempsTop").val();
        var tempsAfter = +pTempsContrincant;
        var tempsDiff = Math.abs(tempsAfter - tempsBefore);
        $("#hiddenTempsTop").val(pTempsContrincant);
        $("#labelTempsTop").html(secondsToHms(pTempsContrincant));
        
        if (tempsDiff <= 5) {
            $("#labelTempsRetardContrincant").html("Bona connexió").css("color", "#009900").css("backgroundColor", "#FFFF99");
        } else {
            $("#labelTempsRetardContrincant").html("Mala connexió: " + tempsDiff + " seg. de retard").css("color", "#FF0000").css("backgroundColor", "#FFFF99");
        }
        
    }
    
    if (isCheckMate === true) {
        escacsVdtClient.processCommand("finishGame" + " " + colorInCheck + " " + "checkmate");
        stopTimer();
        canBeginGame = false;
    }
}

function checkInCheck(pCmd, pColor) {
    var arrayT = commutatorArrayT(pCmd);
    var colorInCheck = pColor;
    var iiJ;
    switch (pColor) {
        //el blanc està en check?
        case COLOR_BLANC:
            var fD = getFitxaDadesFromElDOM(pCmd, "RB1");
            iiJ = fD.iiJ;//getPosicioFitxa(pCmd, "RB");
            colorInCheck = COLOR_NEGRE;

           // console.log("quai:", pCmd, iiJ);

            break;
            //el negre està en check?
        case COLOR_NEGRE:
            var fD = getFitxaDadesFromElDOM(pCmd, "RN1");
            iiJ = fD.iiJ;//getPosicioFitxa(pCmd, "RN");
            colorInCheck = COLOR_BLANC;
            break;
    }

    return checkColorInEstelaByIiJ(pCmd, colorInCheck, iiJ.i, iiJ.j);
}

function checkIfCheckMate(pColor) {
    var b = (checkInCheck(TAULER_REAL, pColor) === true);
    if (b === true) {
        for (var i = 0; i < arrayEsteles.length; i++) {
            for (var j = 0; j < arrayEsteles[i].length; j++) {
                for (var k = 0; k < arrayEsteles[i][j].length; k++) {
                    var fitxaNomDinsEstela = arrayEsteles[i][j][k];
                    fitxaNomDinsEstela = fitxaNomDinsEstela.replace(/@/g, '');
                    var fD = getFitxaDadesFromElDOM(TAULER_REAL, fitxaNomDinsEstela);
                    //mirem si les peces del mateix color que rep el check poden fer alguna cosa per evitar el check
                    if (fD && fD.color === pColor) {
                        copyFromArrayTaulerTo_ArrayTauler();
                        _arrayTauler[i][j] = fitxaNomDinsEstela;
                        setFitxesIEstelesAlTauler(TAULER_VIRTUAL);
                        if (fD.tipusFitxa === 'R') {
                            var _fD = getFitxaDadesFromElDOM(TAULER_VIRTUAL, fitxaNomDinsEstela);
                            _fD.iiJ = new ElMeuPoint(i, j);
                        }
                        b = (checkInCheck(TAULER_VIRTUAL, pColor) === true);
                        if (b === false) {
                            break;
                        }
                    }
                }
                if (b === false) {
                    break;
                }
            }
            if (b === false) {
                break;
            }
        }
    }
    return b;
}

function checkIfStaleMate(pColor) {
    //
    
    return ;
}

function esPossibleEnrocarLlarg(pCmd, pFitxaNom) {
    var arrayT = commutatorArrayT(pCmd);
    var bEsPossible = false;
    var fD = getFitxaDadesFromElDOM(pCmd, pFitxaNom);
    var fD_RB1 = getFitxaDadesFromElDOM(pCmd, "RB1");
    var fD_TB1 = getFitxaDadesFromElDOM(pCmd, "TB1");
    var fD_RN1 = getFitxaDadesFromElDOM(pCmd, "RN1");
    var fD_TN1 = getFitxaDadesFromElDOM(pCmd, "TN1");
    if (pFitxaNom === fD_RB1.nom || pFitxaNom === fD_RN1.nom) {
        var fitxaNom1, fitxaNom2, fitxaNom3;
        switch (fD.color) {
            case COLOR_BLANC:
            {
                fitxaNom1 = arrayT[1][7];
                fitxaNom2 = arrayT[2][7];
                fitxaNom3 = arrayT[3][7];
                bEsPossible = (//que no estigui en escac!
                        checkInCheck(pCmd, fD.color) === false
                        && //que no s'hagi mogut
                        fD_RB1.isMoved === false
                        && //que no s'hagi mogut la torre 
                        fD_TB1.isMoved == false
                        && //que no hagi fitxes pel mig
                        (!fitxaNom1 && !fitxaNom2 && !fitxaNom3)
                        && checkColorInEstelaByIiJ(pCmd, COLOR_NEGRE, 1, 7) === false
                        && checkColorInEstelaByIiJ(pCmd, COLOR_NEGRE, 2, 7) === false
                        && checkColorInEstelaByIiJ(pCmd, COLOR_NEGRE, 3, 7) === false);
                break;
            }
            case COLOR_NEGRE:
            {
                fitxaNom1 = arrayT[1][0];
                fitxaNom2 = arrayT[2][0];
                fitxaNom3 = arrayT[3][0];
                bEsPossible = (//que no estigui en escac!
                        checkInCheck(pCmd, fD.color) === false
                        && //que no s'hagi mogut
                        fD_RN1.isMoved === false
                        && //que no s'hagi mogut la torre 
                        fD_TN1.isMoved === false
                        && //que no hagi fitxes pel mig
                        (!fitxaNom1 && !fitxaNom2 && !fitxaNom3)
                        && checkColorInEstelaByIiJ(pCmd, COLOR_BLANC, 1, 0) === false
                        && checkColorInEstelaByIiJ(pCmd, COLOR_BLANC, 2, 0) === false
                        && checkColorInEstelaByIiJ(pCmd, COLOR_BLANC, 3, 0) === false);
                break;
            }
        }
    }
    return bEsPossible;
}

function esPossibleEnrocarCurt(pCmd, pFitxaNom) {
    var arrayT = commutatorArrayT(pCmd);
    var bEsPossible = false;
    var fD = getFitxaDadesFromElDOM(pCmd, pFitxaNom);
    var fD_RB1 = getFitxaDadesFromElDOM(pCmd, "RB1");
    var fD_TB2 = getFitxaDadesFromElDOM(pCmd, "TB2");
    var fD_RN1 = getFitxaDadesFromElDOM(pCmd, "RN1");
    var fD_TN2 = getFitxaDadesFromElDOM(pCmd, "TN2");
    if (pFitxaNom === fD_RB1.nom || pFitxaNom === fD_RN1.nom) {
        var fitxaNom1, fitxaNom2;
        switch (fD.color) {
            case COLOR_BLANC:
            {
                fitxaNom1 = arrayT[5][7];
                fitxaNom2 = arrayT[6][7];
                bEsPossible = (//que no estigui en escac!
                        checkInCheck(pCmd, fD.color) === false
                        && //que no s'hagi mogut
                        fD_RB1.isMoved === false
                        && //que no s'hagi mogut la torre 
                        fD_TB2.isMoved === false
                        && //que no hagi fitxes pel mig
                        (!fitxaNom1 && !fitxaNom2)
                        && checkColorInEstelaByIiJ(pCmd, COLOR_NEGRE, 5, 7) === false
                        && checkColorInEstelaByIiJ(pCmd, COLOR_NEGRE, 6, 7) === false);
                break;
            }
            case COLOR_NEGRE:
            {
                fitxaNom1 = arrayT[5][0];
                fitxaNom2 = arrayT[6][0];
                bEsPossible = (//que no estigui en escac!
                        checkInCheck(pCmd, fD.color) === false
                        && //que no s'hagi mogut
                        fD_RN1.isMoved === false
                        && //que no s'hagi mogut la torre 
                        fD_TN2.isMoved === false
                        && //que no hagi fitxes pel mig
                        (!fitxaNom1 && !fitxaNom2)
                        && checkColorInEstelaByIiJ(pCmd, COLOR_BLANC, 5, 0) === false
                        && checkColorInEstelaByIiJ(pCmd, COLOR_BLANC, 6, 0) === false);
                break;
            }
        }
    }
    return bEsPossible;
}

function esPossibleCapturarAlPas(pCmd, pFitxaNom) {
    var arrayT = commutatorArrayT(pCmd);
    var sCapturarAlPas = "";
    var fD = getFitxaDadesFromElDOM(pCmd, pFitxaNom);
    var iiJ = fD.iiJ;//getPosicioFitxa(pCmd, pFitxaNom);
    if (fD.tipusFitxa === TIPUS_FITXA_PEO) {
        var _fitxaNom, _fD;
        var filAfectada = 0;
        switch (fD.color) {
            case COLOR_BLANC:
            {
                filAfectada = 3;
                //si el peó negre es troba a la fila 3, llavors...
                break;
            }
            case COLOR_NEGRE:
            {
                filAfectada = 4;
                break;
            }
        }
        var sColorContrari = (fD.color === COLOR_BLANC ? COLOR_NEGRE : COLOR_BLANC);
        if (iiJ.j === filAfectada) {
            //if (fD.iiJInArray.j === filAfectada) {
            var colEsquerra = iiJ.i - 1;
            //var colEsquerra = fD.iiJInArray.i - 1;
            if (colEsquerra >= 0) {
                _fitxaNom = arrayT[colEsquerra][filAfectada];
                _fD = getFitxaDadesFromElDOM(pCmd, _fitxaNom);
                if (_fitxaNom && _fitxaNom !== "") {
                    if (_fD.tipusFitxa === TIPUS_FITXA_PEO
                            && _fD.color === sColorContrari
                            && _fD.isTwoForward === true
                            && _fD.isLastMove === true)
                            //&& llistaFitxesMogudes.get(llistaFitxesMogudes.size() - 1) === _fitxaNom)
                    {
                        sCapturarAlPas = "ESQUERRA|"+_fitxaNom;
                    }
                }
            }
            if (sCapturarAlPas === "") {
                var colDreta = iiJ.i + 1;
                //var colDreta = fD.iiJInArray.i + 1;
                if (colDreta <= 7) {
                    _fitxaNom = arrayT[colDreta][filAfectada];
                    _fD = getFitxaDadesFromElDOM(pCmd, _fitxaNom);
                    if (_fitxaNom && _fitxaNom !== "") {
                        if (_fD.tipusFitxa === TIPUS_FITXA_PEO
                                && _fD.color === sColorContrari
                                && _fD.isTwoForward === true
                                && _fD.isLastMove === true)
                                //&& llistaFitxesMogudes.get(llistaFitxesMogudes.size() - 1) === fitxa)
                        {
                            sCapturarAlPas = "DRETA|"+_fitxaNom;
                        }
                    }
                }
            }
        }
    }
    return sCapturarAlPas;
}

function showCoronacioDialog(pFD) {
    var tableCoronacio =
            "<table id='tableCoronacio' style='width:100%'>" +
            "<tbody>" +
            "  <tr>" +
            "    <td style='width:25%;text-align:center'>" +
            "      <img id='coronarCavall' src='../resources/img/" + TIPUS_FITXA_CAVALL + pFD.color + ".PNG' style='cursor:pointer'>" +
            "    </td>" +
            "    <td style='width:25%;text-align:center'>" +
            "      <img id='coronarAlfil' src='../resources/img/" + TIPUS_FITXA_ALFIL + pFD.color + ".PNG' style='cursor:pointer'>" +
            "    </td>" +
            "    <td style='width:25%;text-align:center'>" +
            "      <img id='coronarTorre' src='../resources/img/" + TIPUS_FITXA_TORRE + pFD.color + ".PNG' style='cursor:pointer'>" +
            "    </td>" +
            "    <td style='width:25%;text-align:center'>" +
            "      <img id='coronarDama' src='../resources/img/" + TIPUS_FITXA_DAMA + pFD.color + ".PNG' style='cursor:pointer'>" +
            "    </td>" +
            "  </tr>" +
            "</tbody>" +
            "</table>";
    window.dialog = $("<div>" + tableCoronacio + "</div>").dialog({
        title: "Corona el peó",
        autoOpen: true,
        closeOnEscape: false,
        modal: true,
        width: 350,
        resizable: false,
        open: function (event, ui) {
            $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
            $('#coronarCavall').on('click', function () {
                coronacio(pFD, TIPUS_FITXA_CAVALL);
                window.dialog.dialog('close');
            });
            $('#coronarAlfil').on('click', function () {
                coronacio(pFD, TIPUS_FITXA_ALFIL);
                window.dialog.dialog('close');
            });
            $('#coronarTorre').on('click', function () {
                coronacio(pFD, TIPUS_FITXA_TORRE);
                window.dialog.dialog('close');
            });
            $('#coronarDama').on('click', function () {
                coronacio(pFD, TIPUS_FITXA_DAMA);
                window.dialog.dialog('close');
            });
        },
        close: function () {
            //
        }
    });
}

//**************************************************************************
//** FIN CHECK MOV'S FITXES AL TAULER **************************************
//**************************************************************************

function copyFromArrayTaulerTo_ArrayTauler() {
    
    //inicialitzem _arrayTauler a tot null
    for (var j = 0; j < _arrayTauler.length; j++) {
        for (var i = 0; i < _arrayTauler[j].length; i++) {
            _arrayTauler[i][j] = null;
        }
    }
    
    //fem una còpia de les fitxes procedents de TAULER_REAL!!!
    for (var j = 0; j < arrayTauler.length; j++) {
        for (var i = 0; i < arrayTauler[j].length; i++) {
            var fitxaNom = arrayTauler[i][j];
            
            var fD = getFitxaDadesFromElDOM(TAULER_REAL, fitxaNom);
            if (fD) {
                var _fD = getFitxaDadesFromElDOM(TAULER_VIRTUAL, fitxaNom);
                if (_fD) {
                    _fD.iiJ = fD.iiJ;
                    _fD.isMoved = fD.isMoved;
                    _fD.isTwoForward = fD.isTwoForward;
                    _fD.isLastMove = fD.isLastMove;
                    setFitxaDadesToElDOM(TAULER_VIRTUAL, fitxaNom, _fD);
                }
            }
            //_arrayTauler[i][j] = fitxaNom;
        }
    }
}

function resetIsLastMoveTaulerReal() {
    for (var j = 0; j < arrayTauler.length; j++) {
        for (var i = 0; i < arrayTauler[j].length; i++) {
            var fitxaNom = arrayTauler[i][j];
            var fD = getFitxaDadesFromElDOM(TAULER_REAL, fitxaNom);
            if (fD) {
                fD.isMoved = false;
            }
        }
    }
}


//**************************************************************************
//** INI ESTELES FITXES AL TAULER ******************************************
//**************************************************************************

function doIsOKAddEstela(pCmd, fDFrom, fDTo, col, fil) {
    var bParar = false;
    if (fDTo && fDTo.nom !== "") {
        if (fDFrom.color === fDTo.color) {
            addEstelaInArrayEsteles(pCmd, fDFrom.color, col, fil);
            bParar = true;
        } else {
            addEstelaInArrayEsteles(pCmd, fDFrom.nom, col, fil);
            bParar = true;
        }
    } else {
        addEstelaInArrayEsteles(pCmd, fDFrom.nom, col, fil);
    }
    return bParar;
}


function setFitxesIEstelesAlTauler(pCmd) {
    var arrayT = commutatorArrayT(pCmd);
    var arrayE = commutatorArrayE(pCmd);
    //inicialitzo estel·les a buides!!!
    for (var j = 0; j < arrayE.length; j++) {
        for (var i = 0; i < arrayE[j].length; i++) {
            if (!arrayE[i][j]) {
                arrayE[i][j] = new Array(0);
            } else {
                var listEsteles = arrayE[i][j];
                listEsteles.splice(0, listEsteles.length);
            }
        }
    }
    //crea estel·les a partir de les fitxes en el tauler (MENYS PER AL REI)
    for (var j = 0; j < arrayT.length; j++) {
        for (var i = 0; i < arrayT[j].length; i++) {
            var fitxaNom = arrayT[i][j];
            if (fitxaNom && fitxaNom !== "") {

                var fD = getFitxaDadesFromElDOM(pCmd, fitxaNom);
                switch (fD.tipusFitxa) {
                    case TIPUS_FITXA_DAMA:
                    {
//                        console.log("dama:", fitxaNom, typeof fitxaNom);
                        setEstelaD(fD);
                        //setEstelaD(pCmd, fitxaNom);
                        break;
                    }
                    case TIPUS_FITXA_ALFIL:
                    {
//                        console.log("alfil:", fitxaNom, typeof fitxaNom);
                        setEstelaA(fD);
                        //setEstelaA(pCmd, fitxaNom);
                        break;
                    }
                    case TIPUS_FITXA_CAVALL:
                    {
//                        console.log("cavall:", fitxaNom, typeof fitxaNom);
                        setEstelaC(fD);
                        //setEstelaC(pCmd, fitxaNom);
                        break;
                    }
                    case TIPUS_FITXA_TORRE:
                    {
//                        console.log("torre:", fitxaNom, typeof fitxaNom);
                        setEstelaT(fD);
                        //setEstelaT(pCmd, fitxaNom);
                        break;
                    }
                    case TIPUS_FITXA_PEO:
                    {
//                        console.log("peo:", fitxaNom, typeof fitxaNom);
                        setEstelaP(fD);
                        //setEstelaP(pCmd, fitxaNom);
                        break;
                    }
                }
            }
        }
    }
    //crea estel·les dels reis, que s'han d'actualitzar al FINAL !!!
    for (var j = 0; j < arrayT.length; j++) {
        for (var i = 0; i < arrayT[j].length; i++) {
            var fitxaNom = arrayT[i][j];
            if (fitxaNom && fitxaNom !== "") {
                var fD = getFitxaDadesFromElDOM(pCmd, fitxaNom);
                if (fD.tipusFitxa === TIPUS_FITXA_REI) {
//                    console.log("rei:", fitxaNom, typeof fitxaNom);
                    setEstelaR(fD);
                    //setEstelaR(pCmd, fitxaNom);
                }
            }
        }
    }
}
//**************************************************************************
//** FIN ESTELES FITXES AL TAULER ******************************************
//**************************************************************************


function doCrearJugadesGraella(/*pFD,*/ pJugada)
{
    $.ajax({
        type: "post",
        url: "/doCrearJugadesGraella",
        datatype: "json",
        data: "IDGRAELLA=" + pJugada.idGraella +
                "&NUMJUGADA=" + pJugada.numJugada +
                "&COLOR=" + pJugada.color +
                "&JUGADA=" + pJugada.jugada.replace( "&#43;", "escac" ),
        async: false,
        //cache: false,
        timeout: 30000,
        success: function (data, textStatus, jqXHR) {
            //alert("success");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        complete: function (jqXHR, textStatus) {
            //
        }
    });
    
}


function doCrearPosicioTauler(/*pFD,*/ pJugada)
{
    var idGraella = pJugada.idGraella;
    var numJugada = pJugada.numJugada;
    var colorUltimaJugada = pJugada.color;
    //var colorUltimaJugada = pFD.color;
    var posicio = codeArrayTaulerReal();
    
    //console.log("idPartida:", param_idPartida, "numJugada:", numJugada, "colorUltimaJugada:", colorUltimaJugada, "posicio:", posicio);
    
    $.ajax({
        type: "post",
        url: "/doCrearPosicioTauler",
        datatype: "json",
        data: "IDGRAELLA=" + idGraella +
                "&IDPARTIDA=" + param_idPartida +
                "&NUMJUGADA=" + numJugada +
                "&COLORULTIMAJUGADA=" + colorUltimaJugada +
                "&POSICIO=" + posicio,
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



function updateFitxesInArrayTauler(pPosicioTauler) {
    //inicialitzem les arrays tauler
    arrayTauler.splice(0, arrayTauler.length);
    _arrayTauler.splice(0, _arrayTauler.length);
    arrayTauler = create2DArray(NUM_FILES, NUM_COLUMNES, null);
    _arrayTauler = create2DArray(NUM_FILES, NUM_COLUMNES, null);
    arrayEsteles = create3DArray(NUM_FILES, NUM_COLUMNES, 0, null);
    _arrayEsteles = create3DArray(NUM_FILES, NUM_COLUMNES, 0, null);
    var aPosicioTauler2D = decodeArrayTaulerReal(pPosicioTauler);
    //files
    for (var j = 0; j < 8; j++) {
        //columnes
        for (var i = 0; i < 8; i++) {
            var fitxaNom = aPosicioTauler2D[i][j];
            if (fitxaNom && fitxaNom != "") {
                var tipusFitxa = fitxaNom.charAt(0);
                var color = fitxaNom.charAt(1);
                var iiJ =  new ElMeuPoint(i, j);
                setFitxaDadesToElDOM(TAULER_REAL, fitxaNom, new FitxaDades(TAULER_REAL, fitxaNom, tipusFitxa, color, false, iiJ, false, false));
                setFitxaDadesToElDOM(TAULER_VIRTUAL, "_"+fitxaNom, new FitxaDades(TAULER_VIRTUAL, "_"+fitxaNom, tipusFitxa, color, false, iiJ, false, false));
            }
        }
    }
    synchronizeEsteles();
}


function codeArrayTaulerReal() {
    var sPosicioTauler = "";
    //files
    for (var j = 0; j < 8; j++) {
        //columnes
        for (var i = 0; i < 8; i++) {
            var fitxaNom = arrayTauler[i][j];
            if (fitxaNom && fitxaNom != "") {
                sPosicioTauler += fitxaNom;
            } else {
                sPosicioTauler += "";
            }
            if (j < 7 || i < 7) {
                sPosicioTauler += ",";
            }
        }
    }
    
    return sPosicioTauler;
}

function decodeArrayTaulerReal(pPosicioTauler) {
    
    var aPosicioTauler2D = create2DArray(NUM_FILES, NUM_COLUMNES, null);
    var aPosicioTauler = pPosicioTauler.split(",");
    var col = 0; 
    var row = 0;
    
    //alert("es 64?:", aPosicioTauler.length);
    
    for (var i = 0; i < aPosicioTauler.length; i++) {
        //si arribem al final de columnes (==7), nova fila (row ++)
        if (col === 8) {
            row++;
            col = 0;
        } 
        aPosicioTauler2D[col][row] = aPosicioTauler[i];
        col++;
    }
}

function showArrayTauler() {
    //////////////////////////////
    //arrayTauler[columna][fila]//
    //////////////////////////////
    var sTauler = "";
    //files
    for (var j = 0; j < 8; j++) {
        sTauler += "\n |";
        //columnes
        for (var i = 0; i < 8; i++) {
            var fitxaNom = arrayTauler[i][j];
            if (fitxaNom && fitxaNom != "") {
                var fD = getFitxaDadesFromElDOM(TAULER_REAL, fitxaNom);
                if (fD.nom === "") {
                    sTauler += "   |";
                } else {
                    sTauler += fD.nom + "|";
                }
            } else {
                sTauler += "   |";
            }
        }
    }
    //  console.log(sTauler);
}
	