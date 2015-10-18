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
var socketio = require("socket.io");

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
            //  allows us to run/test the server locally.
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
            console.log('%s: Received %s - terminating sample server ...',
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
                        IDJUGADOR: pRequest.session.IDJUGADOR,
                        NICKJUGADOR: pRequest.session.NICKJUGADOR,
                        IDREPTE: pRequest.session.IDREPTE,
                        TIPUSJUGADOR: pRequest.session.TIPUSJUGADOR,
                        ELMEUCOLOR: pRequest.session.ELMEUCOLOR,
                        TEMPS: pRequest.session.TEMPS,
                        TEMPSINCREMENT: pRequest.session.TEMPSINCREMENT,
                        IDJUGADORCONTRINCANT: pRequest.session.IDJUGADORCONTRINCANT
                    }]);
                break;
            case "doUpdateRepteSession":
                isSessionOp = true;
                utils.parseReceivedData(pRequest, function (pParams) {
                    pRequest.session.IDREPTE = pParams["IDREPTE"];
                    pRequest.session.TIPUSJUGADOR = pParams["TIPUSJUGADOR"];
                    pRequest.session.ELMEUCOLOR = pParams["ELMEUCOLOR"];
                    pRequest.session.TEMPS = pParams["TEMPS"];
                    pRequest.session.TEMPSINCREMENT = pParams["TEMPSINCREMENT"];
                    pRequest.session.AMBEVALUACIOELO = pParams["AMBEVALUACIOELO"];
                    pRequest.session.IDJUGADORCONTRINCANT = pParams["IDJUGADORCONTRINCANT"];
                    utils.sendJson(pResponse, [{
                            IDJUGADOR: pRequest.session.IDJUGADOR,
                            NICKJUGADOR: pRequest.session.NICKJUGADOR,
                            IDREPTE: pRequest.session.IDREPTE,
                            TIPUSJUGADOR: pRequest.session.TIPUSJUGADOR,
                            ELMEUCOLOR: pRequest.session.ELMEUCOLOR,
                            TEMPS: pRequest.session.TEMPS,
                            TEMPSINCREMENT: pRequest.session.TEMPSINCREMENT,
                            AMBEVALUACIOELO: pRequest.session.AMBEVALUACIOELO,
                            IDJUGADORCONTRINCANT: pRequest.session.IDJUGADORCONTRINCANT
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
        self.server = http.createServer(self.onRequest);
        //self.createRoutes();
        //self.server = express.createServer();
        //var escacsVdtServerSockets = require("./lib/escacs_vdt_server_sockets");
        //escacsVdtServerSockets.listenToMe(self.server);

        //  Add handlers for the app (from the routes).
        /*for (var r in self.routes) {
         self.server.get(r, self.routes[r]);
         }*/
    };


    //per OPENSHIFT -->https://coderwall.com/p/pgk00a/socket-io-and-openshift-websockets
    // socket.io initialization on the server side
    self.initializeSocketIO = function () {
        
        self.io = socketio.listen(self.server);
        //TEMPORAL!!!!!!!!!
        /*
        //per fer DEBUG, escriure al cmd: "DEBUG=socket.io* node myapp"
        self.io.set("log level", 1);
        self.io.enable('browser client minification');  // send minified client
        self.io.enable('browser client etag');          // apply etag caching logic based on version number
        self.io.enable('browser client gzip');          // gzip the file
        self.io.set('log level', 1);                    // reduce logging
        self.io.set('transports', [
            'websocket'
        ]);
        */
        var escacsVdtServerSockets = require("./lib/escacs_vdt_server_sockets");
        escacsVdtServerSockets.addSocketIOEvents(self.io);
        
        //return this;
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
        self.initializeSocketIO();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function () {
        //  Start the server on the specific interface (and port).
        self.server.listen(self.port, self.ipaddress, function () {
            console.log('%s: Servidor Node iniciat a %s:%d ...',
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

