
var path = require("path");
var mime = require("mime");
var qs = require("querystring");


exports.hello = function () {
    return "hello";
};


exports.parseReceivedData = function (pRequest, pCb) {
    var body = "";
    pRequest.setEncoding("utf8");
    pRequest.on("data", function (pChunk) {
        body += pChunk;
    });
    pRequest.on("end", function () {
        var data = qs.parse(body);
        pCb(data);
    });
};


//enviar un missatge d'error si la petició fa referència a un recurs que no existeix
exports.send404 = function (pResponse) {
    pResponse.writeHead(404, {"Content-Type": "text/plain"});
    pResponse.write("Error 404: recurs no trobat.");
    pResponse.end();
};


//primer s'escriu la capçalera HTTP i llavors s'envia amb el contingut del arxius
exports.sendFile = function (pResponse, pFilePath, pFileContents) {
    pResponse.writeHead(
            200,
            {"Content-Type": mime.lookup(path.basename(pFilePath))}
    );
    pResponse.end(pFileContents);
};


exports.sendHtml = function (pResponse, pHtml) {
    pResponse.setHeader("Content-Type", "text/html");
    pResponse.setHeader("Content-Length", Buffer.byteLength(pHtml));
    pResponse.end(pHtml);
};


exports.sendJson = function (pResponse, pJson) {
    if (pJson instanceof Array === true) {
        pJson = JSON.stringify(pJson);
    }
    pResponse.setHeader("Content-Type", "application/json;charset=UTF-8");
    pResponse.setHeader("Content-Length", Buffer.byteLength(pJson));
    pResponse.end(pJson);
};


exports.sleep = function (milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
};


/// $waitUntil
///      waits until a certain function returns true and then executes a code. checks the function periodically
/// parameters
///      check - a function that should return false or true
///      onComplete - a function to execute when the check function returns true
///      delay - time in milliseconds, specifies the time period between each check. default value is 100
///      timeout - time in milliseconds, specifies how long to wait and check the check function before giving up
exports.waitUntil = function (check, onComplete, delay, timeout) {
    // if the check returns true, execute onComplete immediately
    if (check()) {
        onComplete();
        return;
    }

    if (!delay)
        delay = 100;

    var timeoutPointer;
    var intervalPointer = setInterval(function () {
        if (!check())
            return; // if check didn't return true, means we need another check in the next interval

        // if the check returned true, means we're done here. clear the interval and the timeout and execute onComplete
        clearInterval(intervalPointer);
        if (timeoutPointer)
            clearTimeout(timeoutPointer);
        onComplete();
    }, delay);
    // if after timeout milliseconds function doesn't return true, abort
    if (timeout)
        timeoutPointer = setTimeout(function () {
            clearInterval(intervalPointer);
        }, timeout);
};
