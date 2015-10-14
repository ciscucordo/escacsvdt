#!/bin/env node
//  OpenShift sample Node application
//var express = require('express');

var http = require("http");

// special magic, now all requests have sessions!
var session = require('./node_modules_custom/session.js/lib/core').session;

//filesystem
var fs = require("fs");

var path = require("path");
var mime = require("mime");

//var dispatcher = require('httpdispatcher');

var utils = require("./lib/utils");


/**
 *  Define the sample application.
 */
var SampleApp = function () {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function () {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port = process.env.OPENSHIFT_NODEJS_PORT || 3002;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        }
        ;

        

    };


    /**
     *  Populate the cache.
     */
    self.cache = {};
    
    
    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function (sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                    Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () {
            self.terminator();
        });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element, index, array) {
            process.on(element, function () {
                self.terminator(element);
            });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    //guardem els arxius a enviar en cache, perquè l'accés a memòria és més ràpid que l'accés a disc
    function serveStatic(pResponse, pCache, pAbsPath) {
        //mirem si l'arxiu ja està en memòria
        if (pCache[pAbsPath]) {
            //enviem l'arxiu de memòria
            sendFile(pResponse, pAbsPath, pCache[pAbsPath]);
        } else {
            //mirem si l'arxiu existeix en disc
            fs.exists(pAbsPath, function (pExists) {
                if (pExists) {
                    //llegim l'arxiu de disc
                    fs.readFile(pAbsPath, function (pErr, pData) {
                        if (pErr) {
                            send404(pResponse);
                        } else {
                            pCache[pAbsPath] = pData;
                            //enviem l'arxiu des de disc
                            sendFile(pResponse, pAbsPath, pData);
                        }
                    });
                } else {
                    send404(pResponse);
                }
            });
        }
    }

    //enviar un missatge d'error si la petició fa referència a un recurs que no existeix
    function send404(pResponse) {
        pResponse.writeHead(404, {"Content-Type": "text/plain"});
        pResponse.write("Error 404: recurs no trobat.");
        pResponse.end();
    }

    //primer s'escriu la capçalera HTTP i llavors s'envia amb el contingut del arxius
    function sendFile(pResponse, pFilePath, pFileContents) {
        pResponse.writeHead(
                200,
                {"Content-Type": mime.lookup(path.basename(pFilePath))}
        );
        pResponse.end(pFileContents);
    }

    function sendHtml(pResponse, pHtml) {
        pResponse.setHeader("Content-Type", "text/html");
        pResponse.setHeader("Content-Length", Buffer.byteLength(pHtml));
        pResponse.end(pHtml);
    }

    function sendJson(pResponse, pJson) {
        if (pJson instanceof Array === true) {
            pJson = JSON.stringify(pJson);
        }
        pResponse.setHeader("Content-Type", "application/json;charset=UTF-8");
        pResponse.setHeader("Content-Length", Buffer.byteLength(pJson));
        pResponse.end(pJson);
    }


    self.onRequest = function (pRequest, pResponse) {

        // before we process any part of the request, let's give it a session!
        session(pRequest, pResponse, function (pRequest, pResponse) {

            var filePath = false;
            //var isMySqlOp = doMySqlOp(pRequest, pResponse);
            //var isSessionOp = doSessionOp(pRequest, pResponse);


            //dispatcher.dispatch(pRequest, pResponse);
            //si la petició no és de BBDD, llavors servim l'arxiu demanat!!!
            //if (isMySqlOp === false && isSessionOp === false) {
            //determinem l'arxiu HTML a servir per defecte
            if (pRequest.url == "/") {
                filePath = "public/escacsvdt/index.html";


            } else if (pRequest.url == "/hello") {
                filePath = false;
                sendHtml(pResponse, utils.hello());

                //////////////prova jol///////////////////!!!
            } else if (pRequest.url == "/mysql") {

                filePath = false;


                parseReceivedData(pRequest, function (pRow) {
                    var paramsInSql = [];
                    self.db.query(
                            'select * from JUGADOR',
                            paramsInSql,
                            function (err, rows) {
                                if (err)
                                    throw err;
                                if (rows.length > 0) {
                                    var html = "<html><body>Jugadors:<br>";
                                    for (var i = 0; i < rows.length; i++) {
                                        html += "id:" + rows[i].ID;
                                        html += "nick:" + rows[i].NICK;
                                        html += "<br>";
                                    }
                                    html += "</body></html>";
                                    sendHtml(pResponse, html);
                                    //pResponse.send(html);
                                } else {
                                    sendHtml(pResponse, "<html><body>NOPS!</body></html>");
                                    //pResponse.send("<html><body>NOPS!</body></html>");
                                }
                            }
                    );
                });


            } else {
                //traduïm un path URL a un path d'arxiu relatiu
                filePath = "public/escacsvdt" + pRequest.url;
            }

            if (filePath != false) {

                var absPath = filePath;
                //servim l'arxiu estàtic
                serveStatic(pResponse, self.cache, absPath);
            }
            //}

        });

    };


    function doLogin(pRequest, pResponse) {
        parseReceivedData(pRequest, function (pRow) {
            var sql = " SELECT * FROM jugador " +
                    " WHERE 1=1 ";
            var paramsInSql = [];
            for (var propertyName in pRow) {
                sql += " AND " + propertyName + "=? ";
                paramsInSql.push(pRow[propertyName]);
            }
            self.db.query(
                    sql,
                    paramsInSql,
                    function (err, rows) {
                        if (err)
                            throw err;
                        if (rows.length === 1) {
                            pRequest.session.idJugador = rows[0].ID;
                            pRequest.session.nickJugador = rows[0].NICK;

                            doUpdateHoraUltimLogin(pRequest.session.idJugador);
                            doUpdateStateJugador(pRequest.session.idJugador, 0);

                            //servim el resultat de la query en format JSON
                            sendJson(pResponse, rows);
                        } else {
                            sendJson(pResponse, []);
                        }
                    }
            );

        });
    }

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function () {

        self.app = http.createServer(self.onRequest);
        //self.createRoutes();
        //self.app = express.createServer();

        //var escacsVdtServerSockets = require("./lib/escacs_vdt_server_sockets");
        //escacsVdtServerSockets.listenToMe(self.app);

        //  Add handlers for the app (from the routes).
        /*for (var r in self.routes) {
         self.app.get(r, self.routes[r]);
         }*/
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function () {
        self.setupVariables();
        //self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function () {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                    Date(Date.now()), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

