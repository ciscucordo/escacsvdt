/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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
}

exports.sleep = function (milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

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
}
