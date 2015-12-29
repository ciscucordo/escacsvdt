
//var jsonSession;
function getXHRSession() {
    return {
        url: '/doGetSession',
        type: 'post',
        datatype: 'json',
        data: "",
        async: true,
        cache: false,
        timeout: 30000/*,
        success: function (data) {
            if (data == "") {
                window.location = './login.htm';
            }
        },
        error: function (s, i, error) {
            window.location = './login.htm';
        }*/
    };
}

function doIfSessionFailure(pErrorMessage) {
    alert("Error a l'obtenir la sessió. Missatge: " + pErrorMessage);
    window.location = './login.htm';
}

function doGetSession() {
    var result = '';
    $.ajax({
        url: '/doGetSession',
        type: 'post',
        datatype: 'json',
        data: "",
        async: false,
        //cache: false,
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

function doUpdateRepteSession(pJsonRepteAcceptat, pRedirecting) {
    var result = "0";
    $.ajax({
        url: '/doUpdateRepteSession',
        type: 'post',
        datatype: 'json',
        data: pJsonRepteAcceptat,
        async: true,
        //cache: false,
        success: function (data) {
            result = "1";
            window.location = pRedirecting;//"./sala.htm";
        },
        error: function (s, i, error) {
            result = "0";
            console.log(error);
            //window.location = "./login.htm";
        }
    });
    return result;
}

function doUpdateVeurePartidaSession(pJsonVeurePartida, pRedirecting) {
    var result = "0";
    $.ajax({
        url: '/doUpdateVeurePartidaSession',
        type: 'post',
        datatype: 'json',
        data: pJsonVeurePartida,
        async: true,
        //cache: false,
        success: function (data) {
            result = "1";
            window.location = pRedirecting;//"./sala.htm";
        },
        error: function (s, i, error) {
            result = "0";
            console.log(error);
            //window.location = "./login.htm";
        }
    });
    return result;
}