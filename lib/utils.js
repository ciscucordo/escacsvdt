/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var qs = require("querystring");

function parseReceivedData(pRequest, pCb) {
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