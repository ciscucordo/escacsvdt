
var mysql = require("mysql");

var db = mysql.createConnection({
    host: process.env.OPENSHIFT_MYSQL_DB_HOST || '127.0.0.1',
    user: process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'escacsvdt',
    password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'escacsvdt',
    port: process.env.OPENSHIFT_MYSQL_DB_PORT || 3306,
    database: process.env.OPENSHIFT_GEAR_NAME || 'escacsvdt'
});

var utils = require('./utils');

exports.listenToMe = function (pRequest, pResponse) {

    var filePath = false;

    //if (pRequest.url.indexOf("mysql-") !== -1) {
    var mySQLOp = pRequest.url.substring(1, pRequest.url.length);
    var arrMySQLOp = mySQLOp.split("-");
    var op = arrMySQLOp[0];
    var table = "";
    if (arrMySQLOp.length === 2) {
        table = arrMySQLOp[1];
    }




    //prova GUAYYYYYYY!!!
    /*var greetingPromise = function() {
     return new Promise(function(resolve, reject) {
     resolve("Hello world");
     });
     };
     console.log("greetingPromise:", greetingPromise);
     greetingPromise()
     .then(function (greeting) {
     return greeting + '!!!!';
     })
     .then(function (greeting) {
     console.log(greeting);    // 'hello world!!!!
     });*/

    console.log("pRequest.url:", pRequest.url, "op:", op);

    var okOp = false;
    switch (op) {
        case "doLogin":
            okOp = doLogin(pRequest, pResponse);
            /*var doLogin = new Promise(function(resolve, reject) {
             console.log("...........ini..........");
             parseReceivedData(pRequest, function(pRow) {
             console.log("pRow:",pRow);
             resolve(pRow);
             
             });
             console.log("...........ini jol..........");
             });
             return doLogin
             .then(function(pRow) {
             console.log("pRow Inside:",pRow);
             var doLogin2 = new Promise(function(resolve, reject) {
             console.log("...........ini2..........");
             var doL = false;
             db.query(
             " SELECT * FROM jugador " +
             " WHERE nick = ? AND password = ? ",
             [pRow.nick, pRow.password],
             function(err, rows) {
             if (err) {
             doL = false;
             } else {
             doL = (rows.length === 1);
             }
             resolve(doL);
             }
             );
             });
             doLogin2
             .then(function(doL) {
             console.log("doL:", doL);
             if (doL === true) {
             filePath = "llistes.htm";
             }
             console.log("...........fin..........");
             //return doL;
             });
             });*/

            break;
        case "doSelect":
            var rows = doSelect(table, pRequest, pResponse);
            //console.log("(rows instanceof Array === true):", (rows instanceof Array === true));
            okOp = (rows instanceof Array === true);
            break;
        case "doInsert":
            okOp = doInsert(table, pRequest, pResponse);
            break;
        case "doUpdate":
            okOp = doUpdate(table, pRequest, pResponse);
            break;
        case "doDelete":
            okOp = doDelete(table, pRequest, pResponse);
            break;
    }
    //}


    //PENDENT!!!
    /*var filePath = false;
     //console.log("okOp:",okOp);
     if (okOp === true) {
     filePath = "llistes.htm";
     }*/

    console.log("filePath ole:", filePath);

    return filePath;
    //return (pRequest.url.indexOf("mysql-") !== -1);
};



function doLogin(pRequest, pResponse) {
        utils.parseReceivedData(pRequest, function (pRow) {
            var sql = " SELECT * FROM jugador " +
                    " WHERE 1=1 ";
            var paramsInSql = [];
            for (var propertyName in pRow) {
                sql += " AND " + propertyName + "=? ";
                paramsInSql.push(pRow[propertyName]);
            }
            db.query(
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

    function doUpdateHoraUltimLogin(pIdJugador) {
        var sql = " UPDATE jugador " +
                " SET horaultimlogin = NOW() " +
                " WHERE id = ? ";
        var paramsInSql = [];
        paramsInSql.push(pIdJugador);
        db.query(
                sql,
                paramsInSql,
                function (err, result) {
                    if (err)
                        throw err;
                    var numAffectedRows = result.affectedRows
                    if (numAffectedRows > 0) {
                        //sendJson(pResponse, [numAffectedRows]);
                    } else {
                        //sendJson(pResponse, []);
                    }
                }
        );
    }

    function doUpdateStateJugador(pIdJugador, pEstat) {
        var sql = " UPDATE jugador " +
                " SET estat = ? " +
                " WHERE id = ? ";
        var paramsInSql = [];
        paramsInSql.push(pEstat);
        paramsInSql.push(pIdJugador);
        db.query(
                sql,
                paramsInSql,
                function (err, result) {
                    if (err)
                        throw err;
                    var numAffectedRows = result.affectedRows
                    if (numAffectedRows > 0) {
                        //sendJson(pResponse, [numAffectedRows]);
                    } else {
                        //sendJson(pResponse, []);
                    }
                }
        );
    }

    function doListJugador(pRequest, pResponse) {
        parseReceivedData(pRequest, function (pRow) {
            var sql = " SELECT * FROM (" +
                    " SELECT DISTINCT(j.id) AS JUGADORLLISTAT_ID " +
                    ", j.nom AS JUGADORLLISTAT_NOM " +
                    ", j.cognoms AS JUGADORLLISTAT_COGNOMS " +
                    ", j.nick AS JUGADORLLISTAT_NICK " +
                    ", j.perfil AS JUGADORLLISTAT_PERFIL " +
                    ", CASE " +
                    "    WHEN j.perfil = 1 THEN 'VDT' " +
                    "    ELSE 'Invitat' " +
                    " END AS JUGADORLLISTAT_PERFIL_DESC " +
                    ", j.elo AS JUGADORLLISTAT_ELO " +
                    ", j.estat AS JUGADORLLISTAT_ESTAT " +
                    ", CASE " +
                    "    WHEN j.estat = -1 THEN 'desconnectat' " +
                    "    WHEN j.estat = 0 THEN 'lliure' " +
                    "    WHEN j.estat = 1 THEN 'reptant' " +
                    "    WHEN j.estat = 2 THEN 'jugant' " +
                    "    ELSE 'desconegut' " +
                    " END AS JUGADORLLISTAT_ESTAT_DESC " +
                    ", DATE_FORMAT(j.horaultimlogin,'%d/%m/%Y %H:%i:%S') AS JUGADORLLISTAT_HORA_ULTIM_LOGIN " +
                    " FROM jugador j " +
                    " ) k WHERE 1=1 ";
            var paramsInSql = [];
            for (var propertyName in pRow) {
                if (pRow[propertyName] != "" && pRow[propertyName] != -2) {
                    sql += " AND UPPER(k." + propertyName + ") LIKE UPPER(CONCAT('%',?,'%')) ";
                    paramsInSql.push(pRow[propertyName]);
                }
            }
            sql += " ORDER BY k.JUGADORLLISTAT_ID ";
            db.query(
                    sql,
                    paramsInSql,
                    function (err, rows) {
                        if (err)
                            throw err;
                        if (rows.length > 0) {
                            sendJson(pResponse, rows);
                        } else {
                            sendJson(pResponse, []);
                        }
                    }
            );
        });
    }

    function doListRepte(pRequest, pResponse) {
        parseReceivedData(pRequest, function (pRow) {
            var sql = " SELECT * FROM (" +
                    " SELECT DISTINCT(r.id) AS REPTELLISTAT_ID " +
                    ", jrd.id AS REPTELLISTAT_IDJUGADORREPTADOR " +
                    ", jrd.nick AS REPTELLISTAT_JUGADORREPTADOR_DESC " +
                    ", jrt.id AS REPTELLISTAT_IDJUGADORREPTAT " +
                    ", jrt.nick AS REPTELLISTAT_JUGADORREPTAT_DESC " +
                    ", CASE " +
                    "    WHEN r.colorJugadorReptador = 'B' THEN 'blanques' " +
                    "    WHEN r.colorJugadorReptador = 'N' THEN 'negres' " +
                    "    ELSE '-' " +
                    " END AS REPTELLISTAT_COLORJUGADORREPTADOR " +
                    ", r.horaInici AS REPTELLISTAT_HORAINICI " +
                    ", r.temps AS REPTELLISTAT_TEMPS " +
                    ", r.tempsIncrement AS REPTELLISTAT_TEMPSINCREMENT " +
                    ", r.ambEvaluacioElo AS REPTELLISTAT_AMBEVALUACIOELO " +
                    ", CASE " +
                    "    WHEN r.ambEvaluacioElo = 1 THEN 'Sí' " +
                    "    WHEN r.ambEvaluacioElo = 0 THEN 'No' " +
                    "    ELSE 'No' " +
                    " END AS REPTELLISTAT_AMBEVALUACIOELO_DESC " +
                    ", r.estat AS REPTELLISTAT_ESTAT " +
                    " FROM repte r " +
                    " INNER JOIN jugador jrd ON r.idJugadorReptador = jrd.id " +
                    " LEFT JOIN jugador jrt ON r.idJugadorReptat = jrt.id " +
                    " ) k WHERE 1=1 ";
            var paramsInSql = [];
            for (var propertyName in pRow) {
                if (pRow[propertyName] != "" && pRow[propertyName] != -2) {
                    sql += " AND UPPER(k." + propertyName + ") LIKE UPPER(CONCAT('%',?,'%')) ";
                    paramsInSql.push(pRow[propertyName]);
                }
            }
            sql += " AND k.REPTELLISTAT_ESTAT = 0 ";//0 = pendent (només!!!)
            sql += " ORDER BY k.REPTELLISTAT_ID ";
            db.query(
                    sql,
                    paramsInSql,
                    function (err, rows) {
                        if (err)
                            throw err;
                        if (rows.length > 0) {
                            sendJson(pResponse, rows);
                        } else {
                            sendJson(pResponse, []);
                        }
                    }
            );
        });
    }



    function doAcceptarRepte(pRequest, pResponse) {
        parseReceivedData(pRequest, function (pRow) {
            var sql = " UPDATE repte " +
                    " SET estat = ? " +
                    " , idJugadorReptat = ? " +
                    " WHERE id = ? ";
            var paramsInSql = [];
            paramsInSql.push(1); //1 = acceptat
            paramsInSql.push(pRow["REPTELLISTAT_IDJUGADORREPTAT"]);
            paramsInSql.push(pRow["REPTELLISTAT_ID"]);
            db.query(
                    sql,
                    paramsInSql,
                    function (err, result) {
                        if (err)
                            throw err;
                        var numAffectedRows = result.affectedRows;
                        if (numAffectedRows > 0) {

                            //doUpdateStateJugador(pRow["REPTELLISTAT_IDJUGADORREPTADOR"], 1);
                            doUpdateStateJugador(pRow["REPTELLISTAT_IDJUGADORREPTAT"], 1);

                            sendJson(pResponse, [numAffectedRows]);
                        } else {
                            sendJson(pResponse, []);
                        }
                    }
            );
        });
    }

    function doCrearRepte(pRequest, pResponse) {
        parseReceivedData(pRequest, function (pRow) {
            var sql = " INSERT INTO repte (" +
                    " idJugadorReptador, " +
                    " colorJugadorReptador, " +
                    " temps, " +
                    " tempsIncrement, " +
                    " ambEvaluacioElo, " +
                    " estat) " +
                    " VALUES ( " +
                    " ?, " +
                    " ?, " +
                    " ?, " +
                    " ?, " +
                    " ?, " +
                    " ? " +
                    " ) ";
            var paramsInSql = [];

            //REPTE_IDJUGADORREPTADOR
            var id = pRow["REPTE_IDJUGADORREPTADOR"];
            id = parseInt(id);
            paramsInSql.push(id);

            //REPTE_COLORJUGADORREPTADOR
            paramsInSql.push(pRow["REPTE_COLORJUGADORREPTADOR"]);

            //REPTE_TEMPS
            var tempsEnSegons = pRow["REPTE_TEMPS"];
            tempsEnSegons = parseInt(tempsEnSegons) * 60;
            paramsInSql.push(tempsEnSegons);

            //REPTE_TEMPSINCREMENT
            tempsEnSegons = pRow["REPTE_TEMPSINCREMENT"];
            tempsEnSegons = parseInt(tempsEnSegons);
            paramsInSql.push(tempsEnSegons);

            //REPTE_AMBEVALUACIOELO
            var ambEvaluacioElo = (pRow["REPTE_AMBEVALUACIOELO"] == "1" ? 1 : 0);
            paramsInSql.push(ambEvaluacioElo);

            //REPTE_ESTAT
            paramsInSql.push(0); //0 = pendent
            db.query(
                    sql,
                    paramsInSql,
                    function (err, result) {
                        if (err)
                            throw err;
                        var numAffectedRows = result.affectedRows;
                        if (numAffectedRows > 0) {



                            sendJson(pResponse, [numAffectedRows]);
                        } else {
                            sendJson(pResponse, []);
                        }
                    }
            );
        });
    }

    function doEliminarRepte(pRequest, pResponse) {
        parseReceivedData(pRequest, function (pRow) {
            var sql = " DELETE FROM repte " +
                    " WHERE id = ? ";
            var paramsInSql = [];

            //REPTELLISTAT_ID
            var id = pRow["REPTELLISTAT_ID"];
            id = parseInt(id);
            paramsInSql.push(id);
            db.query(
                    sql,
                    paramsInSql,
                    function (err, result) {
                        if (err)
                            throw err;
                        var numAffectedRows = result.affectedRows
                        if (numAffectedRows > 0) {
                            sendJson(pResponse, [numAffectedRows]);
                        } else {
                            sendJson(pResponse, []);
                        }
                    }
            );
        });
    }

    function doMirarRepteAcceptat(pRequest, pResponse) {
        parseReceivedData(pRequest, function (pRow) {
            //1) mirar si hi ha algun repte acceptat pel jugador sessió com a reptador
            var sql = " SELECT * FROM repte " +
                    " WHERE idJugadorReptador = ? " +
                    " AND estat = ? " +
                    " AND (dinsSalaJugadorReptador = ? " +
                    "   OR dinsSalaJugadorReptador IS NULL) " +
                    " AND (dinsSalaJugadorReptat = ? " +
                    "   OR dinsSalaJugadorReptat IS NULL) ";
            var paramsInSql = [];

            //idJugadorReptador
            var i = pRow["REPTELLISTAT_IDJUGADOR"];
            i = parseInt(i);
            paramsInSql.push(i);

            //estat
            i = 1; //1 = acceptat
            paramsInSql.push(i);

            //dinsSalaJugadorReptador
            i = 0;
            paramsInSql.push(i);

            //dinsSalaJugadorReptat
            i = 0;
            paramsInSql.push(i);
            db.query(
                    sql,
                    paramsInSql,
                    function (err, rows) {
                        if (err)
                            throw err;
                        if (rows.length > 0) {
                            var json = [{}];
                            json[0].entrarASala = "1";
                            json[0].idRepte = rows[0].ID;
                            json[0].tipusJugador = "reptador";
                            json[0].elMeuColor = rows[0].COLORJUGADORREPTADOR;
                            json[0].temps = rows[0].TEMPS;
                            json[0].tempsIncrement = rows[0].TEMPSINCREMENT;
                            json[0].idJugadorContrincant = rows[0].IDJUGADORREPTAT;

                            doUpdateStateJugador(json[0].idJugadorContrincant, 2);

                            sendJson(pResponse, json);
                        } else {
                            //2) mirar si hi ha algun repte acceptat pel jugador sessió com a reptat
                            sql = " SELECT * FROM repte " +
                                    " WHERE idJugadorReptat = ? " +
                                    " AND estat = ? " +
                                    " AND (dinsSalaJugadorReptat = ? " +
                                    "   OR dinsSalaJugadorReptat IS NULL) " +
                                    " AND dinsSalaJugadorReptador = ? ";
                            var paramsInSql = [];

                            //idJugadorReptat
                            var i = pRow["REPTELLISTAT_IDJUGADOR"];
                            i = parseInt(i);
                            paramsInSql.push(i);

                            //estat
                            i = 1; //1 = acceptat
                            paramsInSql.push(i);

                            //dinsSalaJugadorReptador
                            i = 0;
                            paramsInSql.push(i);

                            //dinsSalaJugadorReptat
                            i = 1;
                            paramsInSql.push(i);

                            db.query(
                                    sql,
                                    paramsInSql,
                                    function (err, rows) {
                                        if (err)
                                            throw err;
                                        if (rows.length > 0) {
                                            var json = [{}];
                                            json[0].entrarASala = "1";
                                            json[0].idRepte = rows[0].ID;
                                            json[0].tipusJugador = "reptat";
                                            var color = "B";
                                            if (rows[0].COLORJUGADORREPTADOR == "B") {
                                                color = "N";
                                            }
                                            json[0].elMeuColor = color;
                                            json[0].temps = rows[0].TEMPS;
                                            json[0].tempsIncrement = rows[0].TEMPSINCREMENT;
                                            json[0].idJugadorContrincant = rows[0].IDJUGADORREPTADOR;

                                            doUpdateStateJugador(json[0].idJugadorContrincant, 2);

                                            sendJson(pResponse, json);
                                        } else {
                                            var json = [{}];
                                            json[0].entrarASala = "0";
                                            sendJson(pResponse, json);
                                        }
                                    }
                            );
                        }
                    }
            );
        });

    }

    function doDinsSalaRepteAcceptat(pRequest, pResponse) {
        parseReceivedData(pRequest, function (pRow) {
            var sql = " UPDATE repte " +
                    " SET ";
            var paramsInSql = [];
            if (pRow["tipusJugador"] == "reptador") {
                sql += " dinsSalaJugadorReptador = 1 ";
            } else if (pRow["tipusJugador"] == "reptat") {
                sql += " dinsSalaJugadorReptat = 1 ";
            }
            sql += " WHERE id = ? ";
            //ID
            var i = pRow["idRepte"];
            i = parseInt(i);
            paramsInSql.push(i);
            db.query(
                    sql,
                    paramsInSql,
                    function (err, result) {
                        if (err)
                            throw err;
                        var numAffectedRows = result.affectedRows
                        if (numAffectedRows > 0) {
                            sendJson(pResponse, [numAffectedRows]);
                        } else {
                            sendJson(pResponse, []);
                        }
                    }
            );
        });
    }


    function doCrearPartida(pRequest, pResponse) {
        parseReceivedData(pRequest, function (pRow) {
            var sql = " INSERT INTO partida (" +
                    " idRepte, " +
                    " idJugadorBlanques, " +
                    " idJugadorNegres, " +
                    " temps, " +
                    " tempsIncrement, " +
                    " ambEvaluacioElo, " +
                    " estat) " +
                    " VALUES ( " +
                    " ?, " +
                    " ?, " +
                    " ?, " +
                    " ?, " +
                    " ?, " +
                    " ?, " +
                    " ? " +
                    " ) ";
            var paramsInSql = [];

            //IDREPTE
            var id = pRow["IDREPTE"];
            id = parseInt(id);
            paramsInSql.push(id);

            //IDJUGADORBLANQUES
            var id = pRow["IDJUGADORBLANQUES"];
            id = parseInt(id);
            paramsInSql.push(id);

            //IDJUGADORNEGRES
            var id = pRow["IDJUGADORNEGRES"];
            id = parseInt(id);
            paramsInSql.push(id);

            //TEMPS
            var id = pRow["TEMPS"];
            id = parseInt(id);
            paramsInSql.push(id);

            //TEMPSINCREMENT
            var id = pRow["TEMPSINCREMENT"];
            id = parseInt(id);
            paramsInSql.push(id);

            //AMBEVALUACIOELO
            var ambEvaluacioElo = (pRow["AMBEVALUACIOELO"] == "1" ? 1 : 0);
            paramsInSql.push(ambEvaluacioElo);

            //ESTAT
            paramsInSql.push(0); //0 = jugant

            db.query(
                    sql,
                    paramsInSql,
                    function (err, result) {
                        if (err)
                            throw err;
                        var numAffectedRows = result.affectedRows;
                        if (numAffectedRows > 0) {
                            sendJson(pResponse, [numAffectedRows]);
                        } else {
                            sendJson(pResponse, []);
                        }
                    }
            );
        });
    }


    function doCrearPosicioTauler(pRequest, pResponse) {
        parseReceivedData(pRequest, function (pRow) {
            var sql = " INSERT INTO posicioTauler (" +
                    " idPartida, " +
                    " numJugada, " +
                    " colorUltimaJugada, " +
                    " posicio) " +
                    " VALUES ( " +
                    " ?, " +
                    " ?, " +
                    " ?, " +
                    " ? " +
                    " ) ";
            var paramsInSql = [];

            //IDPARTIDA
            var id = pRow["IDPARTIDA"];
            id = parseInt(id);
            paramsInSql.push(id);

            //NUMJUGADA
            var id = pRow["NUMJUGADA"];
            id = parseInt(id);
            paramsInSql.push(id);

            //COLORULTIMAJUGADA
            paramsInSql.push(pRow["COLORULTIMAJUGADA"]);

            //POSICIO
            paramsInSql.push(pRow["POSICIO"]);

            db.query(
                    sql,
                    paramsInSql,
                    function (err, result) {
                        if (err)
                            throw err;
                        var numAffectedRows = result.affectedRows;
                        if (numAffectedRows > 0) {
                            sendJson(pResponse, [numAffectedRows]);
                        } else {
                            sendJson(pResponse, []);
                        }
                    }
            );
        });
    }


    function doUpdateResultatPartida(pRequest, pResponse) {
        parseReceivedData(pRequest, function (pRow) {
            var sql = " UPDATE partida " +
                    " SET ";
            var paramsInSql = [];
            sql += " resultat = ? ";
            sql += " WHERE id = ? ";
            //RESULTAT
            var i = pRow["RESULTAT"];
            i = parseInt(i);
            paramsInSql.push(i);
            //ID
            var i = pRow["IDPARTIDA"];
            i = parseInt(i);
            paramsInSql.push(i);
            db.query(
                    sql,
                    paramsInSql,
                    function (err, result) {
                        if (err)
                            throw err;
                        var numAffectedRows = result.affectedRows;
                        if (numAffectedRows > 0) {
                            sendJson(pResponse, [numAffectedRows]);
                        } else {
                            sendJson(pResponse, []);
                        }
                    }
            );
        });
    }


    function doSelect(pTable, pRequest, pResponse) {
        parseReceivedData(pRequest, function (pRow) {
            var sql = " SELECT * FROM " + pTable +
                    " WHERE 1=1 ";
            var paramsInSql = [];
            for (var propertyName in pRow) {
                sql += " AND " + propertyName + "=? ";
                paramsInSql.push(pRow[propertyName]);
            }
            db.query(
                    sql,
                    paramsInSql,
                    function (err, rows) {
                        if (err)
                            throw err;
                        if (rows.length > 0) {
                            //servim el resultat de la query en format JSON
                            sendJson(pResponse, rows);
                        } else {
                            sendJson(pResponse, []);
                        }
                    }
            );
        });
    }