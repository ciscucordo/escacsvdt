//Returns the object's class, Array, Date, RegExp, Object are of interest to us
var getClass = function (val) {
    return Object.prototype.toString.call(val)
            .match(/^\[object\s(.*)\]$/)[1];
};

//Defines the type of the value, extended typeof
var whatis = function (val) {

    if (val === undefined)
        return 'undefined';
    if (val === null)
        return 'null';

    var type = typeof val;

    if (type === 'object')
        type = getClass(val).toLowerCase();

    if (type === 'number') {
        if (val.toString().indexOf('.') > 0)
            return 'float';
        else
            return 'integer';
    }

    return type;
};

var compareObjects = function (a, b) {
    if (a === b)
        return true;
    for (var i in a) {
        if (b.hasOwnProperty(i)) {
            if (!equal(a[i], b[i]))
                return false;
        } else {
            return false;
        }
    }

    for (var i in b) {
        if (!a.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
};

var compareArrays = function (a, b) {
    if (a === b)
        return true;
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; i++) {
        if (!equal(a[i], b[i]))
            return false;
    }
    ;
    return true;
};

var _equal = {};
_equal.array = compareArrays;
_equal.object = compareObjects;
_equal.date = function (a, b) {
    return a.getTime() === b.getTime();
};
_equal.regexp = function (a, b) {
    return a.toString() === b.toString();
};
//	uncoment to support function as string compare
//	_equal.fucntion =  _equal.regexp;



/*
 * Are two values equal, deep compare for objects and arrays.
 * @param a {any}
 * @param b {any}
 * @return {boolean} Are equal?
 */
var equal = function (a, b) {
    if (a !== b) {
        var atype = whatis(a), btype = whatis(b);

        if (atype === btype)
            return _equal.hasOwnProperty(atype) ? _equal[atype](a, b) : a == b;

        return false;
    }

    return true;
};



//de moment queda substituïda per "function getPosicioFitxa(pCmd, pFitxaNom)"
function getIiJInArrayTauler(pArrayTauler, valueToSearch, currentIndex) {
    var iiJInArrayTauler = _getIiJInArrayTauler(pArrayTauler, valueToSearch, currentIndex);
    if (iiJInArrayTauler !== false) {
        var s = iiJInArrayTauler.split(",");
        iiJInArrayTauler = new ElMeuPoint(parseInt(s[0]), parseInt(s[1]));
    }
    return iiJInArrayTauler;
}

function _getIiJInArrayTauler(pArrayTauler, valueToSearch, currentIndex) {
    if (currentIndex == undefined)
        currentIndex = '';
    if (Array.isArray(pArrayTauler)) {
        for (var i = 0; i < pArrayTauler.length; i++) {
            if (Array.isArray(pArrayTauler[i])) {
                newIndex = _getIiJInArrayTauler(pArrayTauler[i], valueToSearch, currentIndex + i + ',');
                if (newIndex)
                    return newIndex;
            } else if (pArrayTauler[i] == valueToSearch) {
                return currentIndex + i;
            }
        }
    } else if (pArrayTauler == valueToSearch) {
        return currentIndex + i;
    }
    return false;
}


function showAlertDialog(pTitle, pMessage) {
    window.dialog = $("<div>" + pMessage + "</div>").dialog({
        title: pTitle,
        autoOpen: true,
        modal: true,
        width: 500,
        resizable: false,
        buttons: [{
                text: "Tanca",
                id: "buttonTanca",
                name: "buttonTanca",
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
}


/*
 //recórrer les propietats i valors d'un objecte!!!
 for(var propertyName in pRequest.session) {
 // propertyName is what you want
 // you can get the value like this: myObject[propertyName]
 }
 */

function removeOptionsFromSelect(pSelectObj)
{
    var i;
    for (i = pSelectObj.options.length - 1; i >= 0; i--)
    {
        pSelectObj.remove(i);
    }
}

function addOptionToSelect(pSelectObj, pDescription, pValue)
{
    var option = document.createElement("option");
    option.text = pDescription;
    option.value = pValue;
    pSelectObj.add(option);
}


function getPartNumber(number, part, decimals)
{
    if ((decimals <= 0) || (decimals == null))
        decimals = 1;
    decimals = Math.pow(10, decimals);
    var intPart = Math.floor(number);
    var fracPart = (number % 1) * decimals;
    fracPart = fracPart.toFixed(0);
    if (part == 'int')
        return intPart;
    else
        return fracPart;
}



function secondsToHms(d)
{
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    var sH, sM, sS;
    if (h < 10) {
        sH = "0" + h;
    } else {
        sH = h;
    }
    if (m < 10) {
        sM = "0" + m;
    } else {
        sM = m;
    }
    if (s < 10) {
        sS = "0" + s;
    } else {
        sS = s;
    }
    return sH + ":" + sM + ":" + sS;
}


/*
// mira si el valor d'una variable est� assignat, etc...

if( value ) {
}

will evaluate to true if value is not:

    null
    undefined
    NaN
    empty string ("")
    0
    false

*/

function displayTime() {
    var str = "";

    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    /*if(hours > 11){
        str += "PM";
    } else {
        str += "AM";
    }*/
    return str;
}