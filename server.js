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

var mysql = require("mysql");
var qs = require("querystring");

/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 3002;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
		
		self.db = mysql.createConnection({
			host: process.env.OPENSHIFT_MYSQL_DB_HOST || self.ipaddress,
			user: process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'escacsvdt',
			password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'escacsvdt',
			port: process.env.OPENSHIFT_MYSQL_DB_PORT || 3306,
			database: process.env.OPENSHIFT_GEAR_NAME || 'escacsvdt'
		});
		
    };

	
    /**
     *  Populate the cache.
     */
	self.cache = {};
    /*
	self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };
	*/
	

    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    /*
	self.cache_get = function(key) { return self.zcache[key]; };
	*/
	

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    /*
	self.createRoutes = function() {
        self.routes = { };

        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };
		
		self.routes['/mysql'] = function(req, res) {
			var paramsInSql = [];
			self.db.query(
				'select * from JUGADOR',
				[],
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
						res.send(html);
					} else {
						res.send("<html><body>NOPS!</body></html>");
					}
				}
            );
        };
		
    };
	*/
	
	
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
                {"content-type": mime.lookup(path.basename(pFilePath))}
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
					
					
				//prova!!!
				} else if (pRequest.url == "/mysql") {
					var paramsInSql = [];
					self.db.query(
						'select * from JUGADOR',
						[],
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
								res.send(html);
							} else {
								res.send("<html><body>NOPS!</body></html>");
							}
						}
					);
					
					
                } else {
                    //traduïm un path URL a un path d'arxiu relatiu
                    filePath = "public/escacsvdt/pages" + pRequest.url;
                }
                var absPath = filePath;
                //servim l'arxiu estàtic
                serveStatic(pResponse, self.cache, absPath);
            //}

        });

    };

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        
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
    self.initialize = function() {
        self.setupVariables();
        //self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

