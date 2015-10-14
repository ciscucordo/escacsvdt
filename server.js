#!/bin/env node
//  OpenShift sample Node application
//var express = require('express');

var http = require("http");

// special magic, now all requests have sessions!
var session = require('./node_modules_custom/session.js/lib/core').session;

//filesystem
var fs = require("fs");



//var dispatcher = require('httpdispatcher');

var utils = require("./lib/utils");
var dbLib = require("./lib/escacs_vdt_server_mysql");

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
            utils.sendFile(pResponse, pAbsPath, pCache[pAbsPath]);
        } else {
            //mirem si l'arxiu existeix en disc
            fs.exists(pAbsPath, function (pExists) {
                if (pExists) {
                    //llegim l'arxiu de disc
                    fs.readFile(pAbsPath, function (pErr, pData) {
                        if (pErr) {
                            utils.send404(pResponse);
                        } else {
                            pCache[pAbsPath] = pData;
                            //enviem l'arxiu des de disc
                            utils.sendFile(pResponse, pAbsPath, pData);
                        }
                    });
                } else {
                    utils.send404(pResponse);
                }
            });
        }
    }


    function doSessionOp(pRequest, pResponse) {
        var isSessionOp = false;
        var op = pRequest.url.substring(1, pRequest.url.length);
        switch (op) {
            case "doGetSession":
                isSessionOp = true;
                utils.sendJson(pResponse, [{
                        idJugador: pRequest.session.idJugador,
                        nickJugador: pRequest.session.nickJugador,
                        idRepte: pRequest.session.idRepte,
                        tipusJugador: pRequest.session.tipusJugador,
                        elMeuColor: pRequest.session.elMeuColor,
                        temps: pRequest.session.temps,
                        tempsIncrement: pRequest.session.tempsIncrement,
                        idJugadorContrincant: pRequest.session.idJugadorContrincant
                    }]);
                break;
            case "doUpdateRepteSession":
                isSessionOp = true;
                utils.parseReceivedData(pRequest, function (pParams) {
                    pRequest.session.idRepte = pParams["idRepte"];
                    pRequest.session.tipusJugador = pParams["tipusJugador"];
                    pRequest.session.elMeuColor = pParams["elMeuColor"];
                    pRequest.session.temps = pParams["temps"];
                    pRequest.session.tempsIncrement = pParams["tempsIncrement"];
                    pRequest.session.ambEvaluacioElo = pParams["ambEvaluacioElo"];
                    pRequest.session.idJugadorContrincant = pParams["idJugadorContrincant"];
                    utils.sendJson(pResponse, [{
                            idJugador: pRequest.session.idJugador,
                            nickJugador: pRequest.session.nickJugador,
                            idRepte: pRequest.session.idRepte,
                            tipusJugador: pRequest.session.tipusJugador,
                            elMeuColor: pRequest.session.elMeuColor,
                            temps: pRequest.session.temps,
                            tempsIncrement: pRequest.session.tempsIncrement,
                            ambEvaluacioElo: pRequest.session.ambEvaluacioElo,
                            idJugadorContrincant: pRequest.session.idJugadorContrincant
                        }]);
                });
                break;
        }
        return isSessionOp;
    }


    self.onRequest = function (pRequest, pResponse) {
        var rootSitePath = "public/escacsvdt"; 
        // before we process any part of the request, let's give it a session!
        session(pRequest, pResponse, function (pRequest, pResponse) {
            var filePath = false;
            var isMySqlOp = dbLib.doMySqlOp(process, pRequest, pResponse);
            var isSessionOp = doSessionOp(pRequest, pResponse);
            //dispatcher.dispatch(pRequest, pResponse);
            //si la petició no és de BBDD, llavors servim l'arxiu demanat!!!
            if (isMySqlOp === false && isSessionOp === false) {
                //determinem l'arxiu HTML a servir per defecte
                if (pRequest.url === "/") {
                    filePath = rootSitePath + "/index.html";
                } else {
                    //traduïm un path URL a un path d'arxiu relatiu
                    filePath = rootSitePath + pRequest.url;
                }
                var absPath = filePath;
                //servim l'arxiu estàtic
                serveStatic(pResponse, self.cache, absPath);
            }
        });
    };


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

