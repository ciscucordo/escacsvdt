
var mysql = require("mysql");
var utils = require('./utils');

var db;


exports.doMySqlOp = function (pOPENSHIFT_MAIN_PROCESS, pRequest, pResponse) {
    if (!db) {
        db = mysql.createConnection({
            host: pOPENSHIFT_MAIN_PROCESS.env.OPENSHIFT_MYSQL_DB_HOST || '127.0.0.1',
            user: pOPENSHIFT_MAIN_PROCESS.env.OPENSHIFT_MYSQL_DB_USERNAME || 'escacsvdt',
            password: pOPENSHIFT_MAIN_PROCESS.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'escacsvdt',
            port: pOPENSHIFT_MAIN_PROCESS.env.OPENSHIFT_MYSQL_DB_PORT || 3306,
            database: pOPENSHIFT_MAIN_PROCESS.env.OPENSHIFT_GEAR_NAME || 'escacsvdt'
        });
    }
    var isMySqlOp = false;
    var mySQLOp = pRequest.url.substring(1, pRequest.url.length);
    var arrMySQLOp = mySQLOp.split("-");
    var op = arrMySQLOp[0];
    var table = "";
    if (arrMySQLOp.length === 2) {
        table = arrMySQLOp[1];
    }
    switch (op) {

        ///////////////////////ini PROVES///////////////////////
        case "doShowDbProperties":
            isMySqlOp = true;
            utils.sendHtml(pResponse, pOPENSHIFT_MAIN_PROCESS.env.OPENSHIFT_MYSQL_DB_HOST +
                    "|" + pOPENSHIFT_MAIN_PROCESS.env.OPENSHIFT_MYSQL_DB_USERNAME +
                    "|" + pOPENSHIFT_MAIN_PROCESS.env.OPENSHIFT_MYSQL_DB_PASSWORD +
                    "|" + pOPENSHIFT_MAIN_PROCESS.env.OPENSHIFT_MYSQL_DB_PORT +
                    "|" + pOPENSHIFT_MAIN_PROCESS.env.OPENSHIFT_GEAR_NAME);
            break;
        case "doProva":
            isMySqlOp = true;
            doProva(pRequest, pResponse);
            break;
        ///////////////////////fin PROVES///////////////////////


        case "doLogin":
            isMySqlOp = true;
            doLogin(pRequest, pResponse);
            break;
        case "doLogout":
            isMySqlOp = true;
            doLogout(pRequest, pResponse);
            break;
        case "doListJugador":
            isMySqlOp = true;
            doListJugador(pRequest, pResponse);
            break;
        case "doUpdateStateJugador":
            isMySqlOp = true;
            doUpdateStateJugador(pRequest, pResponse);
            break;
        case "doListRepte":
            isMySqlOp = true;
            doListRepte(pRequest, pResponse);
            break;
        case "doCrearRepte":
            isMySqlOp = true;
            doCrearRepte(pRequest, pResponse);
            break;
        case "doEliminarRepte":
            isMySqlOp = true;
            doEliminarRepte(pRequest, pResponse);
            break;
        case "doAcceptarRepte":
            isMySqlOp = true;
            doAcceptarRepte(pRequest, pResponse);
            break;
        case "doMirarReptesAMi":
            isMySqlOp = true;
            doMirarReptesAMi(pRequest, pResponse);
            break;
        case "doMirarRepteAcceptat":
            isMySqlOp = true;
            doMirarRepteAcceptat(pRequest, pResponse);
            break;
        case "doDinsSalaRepteAcceptat":
            isMySqlOp = true;
            doDinsSalaRepteAcceptat(pRequest, pResponse);
            break;
        case "doCrearPartida":
            isMySqlOp = true;
            doCrearPartida(pRequest, pResponse);
            break;
        case "doCrearPosicioTauler":
            isMySqlOp = true;
            doCrearPosicioTauler(pRequest, pResponse);
            break;
        case "doUpdateResultatPartida":
            isMySqlOp = true;
            doUpdateResultatPartida(pRequest, pResponse);
            break;
        case "doSelect":
            isMySqlOp = true;
            var rows = doSelect(table, pRequest, pResponse);
            //console.log("(rows instanceof Array === true):", (rows instanceof Array === true));
            okOp = (rows instanceof Array === true);
            break;
        case "doInsert":
            isMySqlOp = true;
            doInsert(table, pRequest, pResponse);
            break;
        case "doUpdate":
            isMySqlOp = true;
            doUpdate(table, pRequest, pResponse);
            break;
        case "doDelete":
            isMySqlOp = true;
            doDelete(table, pRequest, pResponse);
            break;
    }
    return isMySqlOp;
}
;

function doProva(pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        var paramsInSql = [];
        db.query(
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
                        utils.sendHtml(pResponse, html);
                    } else {
                        utils.sendHtml(pResponse, "<html><body>NOPS!</body></html>");
                    }
                }
        );
    });
}

function doLogin(pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        var sql = " select * from JUGADOR " +
                " where 1=1 ";
        var paramsInSql = [];
        for (var propertyName in pRow) {
            propertyName = propertyName.toUpperCase();
            sql += " and " + propertyName + "=? ";
            paramsInSql.push(pRow[propertyName]);
        }
        db.query(
                sql,
                paramsInSql,
                function (err, rows) {
                    if (err)
                        throw err;
                    if (rows.length === 1) {
                        pRequest.session.data.IDJUGADOR = rows[0].ID;
                        pRequest.session.data.user = rows[0].NICK;
                        //pRequest.session.data.NICKJUGADOR = rows[0].NICK;
                        doUpdateHoraUltimLogin(pRequest.session.data.IDJUGADOR);
                        doUpdateStateJugador(pRequest.session.data.IDJUGADOR, 0);
                        
                        //servim el resultat de la query en format JSON
                        utils.sendJson(pResponse, rows);
                    
                    } else {
                        
                        utils.sendJson(pResponse, []);
                        
                    }
                }
        );
    });
}

function doLogout(pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        doUpdateStateJugador(pRequest.session.data.IDJUGADOR, -1);
        pRequest.session.data.user = "Guest";
        pRequest.session.destroy();
        utils.sendJson(pResponse, "1");
    });
    
}

function doUpdateHoraUltimLogin(pIdJugador) {
    var sql = " update JUGADOR " +
            " set HORAULTIMLOGIN = now() " +
            " where ID = ? ";
    var paramsInSql = [];
    paramsInSql.push(pIdJugador);
    db.query(
            sql,
            paramsInSql,
            function (err, result) {
                if (err)
                    throw err;
                var numAffectedRows = result.affectedRows;
                if (numAffectedRows > 0) {
                    //utils.sendJson(pResponse, [numAffectedRows]);
                } else {
                    //utils.sendJson(pResponse, []);
                }
            }
    );
}

function doUpdateStateJugador(pIdJugador, pEstat) {
    var sql = " update JUGADOR " +
            " set ESTAT = ? " +
            " where ID = ? ";
    var paramsInSql = [];
    paramsInSql.push(pEstat);
    paramsInSql.push(pIdJugador);
    db.query(
            sql,
            paramsInSql,
            function (err, result) {
                if (err)
                    throw err;
                var numAffectedRows = result.affectedRows;
                if (numAffectedRows > 0) {
                    //utils.sendJson(pResponse, [numAffectedRows]);
                } else {
                    //utils.sendJson(pResponse, []);
                }
            }
    );
}

function doListJugador(pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        var sql = " select * from (" +
                " select distinct(j.ID) as JUGADORLLISTAT_ID " +
                ", j.NOM as JUGADORLLISTAT_NOM " +
                ", j.COGNOMS as JUGADORLLISTAT_COGNOMS " +
                ", j.NICK as JUGADORLLISTAT_NICK " +
                ", j.PERFIL as JUGADORLLISTAT_PERFIL " +
                ", case " +
                "    when j.PERFIL = 1 then 'VDT' " +
                "    else 'Invitat' " +
                " end as JUGADORLLISTAT_PERFIL_DESC " +
                ", j.ELO as JUGADORLLISTAT_ELO " +
                ", j.ESTAT as JUGADORLLISTAT_ESTAT " +
                ", CASE " +
                "    when j.ESTAT = -1 then 'desconnectat' " +
                "    when j.ESTAT = 0 then 'lliure' " +
                "    when j.ESTAT = 1 then 'reptant' " +
                "    when j.ESTAT = 2 then 'jugant' " +
                "    else 'desconegut' " +
                " end as JUGADORLLISTAT_ESTAT_DESC " +
                ", date_format(j.HORAULTIMLOGIN,'%d/%m/%Y %H:%i:%S') as JUGADORLLISTAT_HORA_ULTIM_LOGIN " +
                " from JUGADOR j " +
                " ) k where 1=1 ";
        var paramsInSql = [];
        for (var propertyName in pRow) {
            propertyName = propertyName.toUpperCase();
            if (pRow[propertyName] != "" && pRow[propertyName] != -2) {
                sql += " and upper(k." + propertyName + ") like upper(concat('%',?,'%')) ";
                paramsInSql.push(pRow[propertyName]);
            }
        }
        sql += " order by k.JUGADORLLISTAT_COGNOMS, k.JUGADORLLISTAT_NOM ";
        db.query(
                sql,
                paramsInSql,
                function (err, rows) {
                    if (err)
                        throw err;
                    if (rows.length > 0) {
                        utils.sendJson(pResponse, rows);
                    } else {
                        utils.sendJson(pResponse, []);
                    }
                }
        );
    });
}

function doListRepte(pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        var sql = " select * from (" +
                " select distinct (r.ID) as REPTELLISTAT_ID " +
                ", jrd.ID as REPTELLISTAT_IDJUGADORREPTADOR " +
                ", jrd.NICK as REPTELLISTAT_JUGADORREPTADOR_DESC " +
                //", jrt.ID as REPTELLISTAT_IDJUGADORREPTAT " +
                //", jrt.NICK as REPTELLISTAT_JUGADORREPTAT_DESC " +
                ", case " +
                "    when r.COLORJUGADORREPTADOR = 'B' then 'blanques' " +
                "    when r.COLORJUGADORREPTADOR = 'N' then 'negres' " +
                "    else '-' " +
                " end as REPTELLISTAT_COLORJUGADORREPTADOR " +
                ", r.HORAINICI as REPTELLISTAT_HORAINICI " +
                ", r.TEMPS as REPTELLISTAT_TEMPS " +
                ", r.TEMPSINCREMENT as REPTELLISTAT_TEMPSINCREMENT " +
                ", r.AMBEVALUACIOELO as REPTELLISTAT_AMBEVALUACIOELO " +
                ", case " +
                "    when r.AMBEVALUACIOELO = 1 then 'Sí' " +
                "    when r.AMBEVALUACIOELO = 0 then 'No' " +
                "    else 'No' " +
                " end as REPTELLISTAT_AMBEVALUACIOELO_DESC " +
                ", r.ESTAT as REPTELLISTAT_ESTAT " +
                ", r.IDJUGADORREPTAT as REPTELLISTAT_IDJUGADORREPTAT " +
                " from REPTE r " +
                " inner join JUGADOR jrd on r.IDJUGADORREPTADOR = jrd.ID " +
                //" left join JUGADOR jrt on r.IDJUGADORREPTAT = jrt.ID " +
                " ) k where 1=1 ";
        var paramsInSql = [];
        for (var propertyName in pRow) {
            propertyName = propertyName.toUpperCase();
            if (pRow[propertyName] != "" && pRow[propertyName] != -2) {
                sql += " and upper(k." + propertyName + ") like upper(concat('%',?,'%')) ";
                paramsInSql.push(pRow[propertyName]);
            }
        }
        sql += " and k.REPTELLISTAT_ESTAT = 0 "; //0 = pendent (només!!!)
        sql += " and k.REPTELLISTAT_IDJUGADORREPTAT IS NULL "; //mostrar reptes que encara no hi hagi jugador reptat assignat
        sql += " order by k.REPTELLISTAT_ID ";
        db.query(
                sql,
                paramsInSql,
                function (err, rows) {
                    if (err)
                        throw err;
                    if (rows.length > 0) {
                        utils.sendJson(pResponse, rows);
                    } else {
                        utils.sendJson(pResponse, []);
                    }
                }
        );
    });
}



function doAcceptarRepte(pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        var sql = " update REPTE " +
                " set ESTAT = ? " +
                " , IDJUGADORREPTAT = ? " +
                " where ID = ? ";
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
                        utils.sendJson(pResponse, [numAffectedRows]);
                    } else {
                        utils.sendJson(pResponse, []);
                    }
                }
        );
    });
}

function doCrearRepte(pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        
        var idJugadorReptat = pRow["REPTE_IDJUGADORREPTAT"];
        idJugadorReptat = parseInt(idJugadorReptat);
        if (isNaN(idJugadorReptat) === true) {
            idJugadorReptat = false;
        }
        
        var sql = " insert into REPTE (" +
                " IDJUGADORREPTADOR, ";
        if (idJugadorReptat) {
            sql += " IDJUGADORREPTAT, ";
        }
            sql += " COLORJUGADORREPTADOR, " +
                " TEMPS, " +
                " TEMPSINCREMENT, " +
                " AMBEVALUACIOELO, " +
                " ESTAT) " +
                " values ( " +
                " ?, ";
        if (idJugadorReptat) {
            sql += " ?, ";
        }
            sql += " ?, " +
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
        //REPTE_IDJUGADORREPTADOR
        if (idJugadorReptat) {
            paramsInSql.push(idJugadorReptat);
        }
        //REPTE_COLORJUGADORREPTADOR
        paramsInSql.push(pRow["REPTE_COLORJUGADORREPTADOR"]);
        //REPTE_TEMPS
        var tempsEnSegons = pRow["REPTE_TEMPS"];
        tempsEnSegons = parseInt(tempsEnSegons) * 60;
        paramsInSql.push(tempsEnSegons);
        //REPTE_TEMPSINCREMENT
        tempsEnSegons = pRow["REPTE_TEMPSINCREMENT"];
        tempsEnSegons = parseInt(tempsEnSegons);
        if (isNaN(tempsEnSegons) === true) {
            tempsEnSegons = 0;
        }
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
                        utils.sendJson(pResponse, [numAffectedRows]);
                    } else {
                        utils.sendJson(pResponse, []);
                    }
                }
        );
    });
}

function doEliminarRepte(pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        var sql = " delete from REPTE " +
                " where ID = ? ";
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
                    var numAffectedRows = result.affectedRows;
                    if (numAffectedRows > 0) {
                        utils.sendJson(pResponse, [numAffectedRows]);
                    } else {
                        utils.sendJson(pResponse, []);
                    }
                }
        );
    });
}

function doMirarReptesAMi(pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        //1) mirar si hi ha algun repte al jugador sessió com a reptat
        var sql = " select r.*, j.NICK as NICKJUGADORREPTADOR from REPTE r " +
                " left join JUGADOR j on r.IDJUGADORREPTADOR = j.ID " +
                " where r.IDJUGADORREPTAT = ? " +
                " and r.ESTAT = ? " +
                " and (r.DINSSALAJUGADORREPTADOR = ? " +
                "   or r.DINSSALAJUGADORREPTADOR is null) " +
                " and (r.DINSSALAJUGADORREPTAT = ? " +
                "   or r.DINSSALAJUGADORREPTAT is null) " +
                " order by r.ID";
        var paramsInSql = [];
        //idJugadorReptador
        var i = pRow["REPTELLISTAT_IDJUGADORREPTAT"];
        i = parseInt(i);
        paramsInSql.push(i);
        //estat
        i = 0; //0 = pendent
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
                    var json = [{}];
                    if (rows.length > 0) {
                        json[0].ENTRARASALA = "0";
                        json[0].IDREPTE = rows[0].ID;
                        json[0].TIPUSJUGADOR = "reptat";
                        json[0].ELMEUCOLOR = (rows[0].COLORJUGADORREPTADOR === "B" ? "N" : "B");
                        json[0].TEMPS = rows[0].TEMPS / 60;
                        json[0].TEMPSINCREMENT = rows[0].TEMPSINCREMENT;
                        json[0].IDJUGADORREPTAT = rows[0].IDJUGADORREPTAT;
                        json[0].IDJUGADORCONTRINCANT = rows[0].IDJUGADORREPTADOR;
                        json[0].NICKJUGADORCONTRINCANT = rows[0].NICKJUGADORREPTADOR;
                        json[0].AMBEVALUACIOELO = (rows[0].AMBEVALUACIOELO === 1 ? "Sí" : "No");
                        //doUpdateStateJugador(json[0].IDJUGADORCONTRINCANT, 2);
                        //utils.sendJson(pResponse, json);
                    }
                    utils.sendJson(pResponse, json);
                }
        );
    });
}

function doMirarRepteAcceptat(pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        //1) mirar si hi ha algun repte acceptat pel jugador sessió com a reptador
        var sql = " select * from REPTE " +
                " where IDJUGADORREPTADOR = ? " +
                " and ESTAT = ? " +
                " and (DINSSALAJUGADORREPTADOR = ? " +
                "   or DINSSALAJUGADORREPTADOR is null) " +
                " and (DINSSALAJUGADORREPTAT = ? " +
                "   or DINSSALAJUGADORREPTAT is null) ";
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
                        json[0].ENTRARASALA = "1";
                        json[0].IDREPTE = rows[0].ID;
                        json[0].TIPUSJUGADOR = "reptador";
                        json[0].ELMEUCOLOR = rows[0].COLORJUGADORREPTADOR;
                        json[0].TEMPS = rows[0].TEMPS;
                        json[0].TEMPSINCREMENT = rows[0].TEMPSINCREMENT;
                        json[0].IDJUGADORCONTRINCANT = rows[0].IDJUGADORREPTAT;
                        doUpdateStateJugador(json[0].IDJUGADORCONTRINCANT, 2);
                        utils.sendJson(pResponse, json);
                    } else {
                        //2) mirar si hi ha algun repte acceptat pel jugador sessió com a reptat
                        sql = " select * from REPTE " +
                                " where IDJUGADORREPTAT = ? " +
                                " and ESTAT = ? " +
                                " and (DINSSALAJUGADORREPTAT = ? " +
                                "   or DINSSALAJUGADORREPTAT is null) " +
                                " and DINSSALAJUGADORREPTADOR = ? ";
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
                                        json[0].ENTRARASALA = "1";
                                        json[0].IDREPTE = rows[0].ID;
                                        json[0].TIPUSJUGADOR = "reptat";
                                        var color = "B";
                                        if (rows[0].COLORJUGADORREPTADOR == "B") {
                                            color = "N";
                                        }
                                        json[0].ELMEUCOLOR = color;
                                        json[0].TEMPS = rows[0].TEMPS;
                                        json[0].TEMPSINCREMENT = rows[0].TEMPSINCREMENT;
                                        json[0].IDJUGADORCONTRINCANT = rows[0].IDJUGADORREPTADOR;
                                        doUpdateStateJugador(json[0].IDJUGADORCONTRINCANT, 2);
                                        utils.sendJson(pResponse, json);
                                    } else {
                                        var json = [{}];
                                        json[0].ENTRARASALA = "0";
                                        utils.sendJson(pResponse, json);
                                    }
                                }
                        );
                    }
                }
        );
    });
}

function doDinsSalaRepteAcceptat(pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        var sql = " update REPTE " +
                " set ";
        var paramsInSql = [];
        if (pRow["TIPUSJUGADOR"] == "reptador") {
            sql += " DINSSALAJUGADORREPTADOR = 1 ";
        } else if (pRow["TIPUSJUGADOR"] == "reptat") {
            sql += " DINSSALAJUGADORREPTAT = 1 ";
        }
        sql += " where ID = ? ";
        //ID
        var i = pRow["IDREPTE"];
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
                        utils.sendJson(pResponse, [numAffectedRows]);
                    } else {
                        utils.sendJson(pResponse, []);
                    }
                }
        );
    });
}


function doCrearPartida(pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        var sql = " insert into PARTIDA (" +
                " IDREPTE, " +
                " IDJUGADORBLANQUES, " +
                " IDJUGADORNEGRES, " +
                " TEMPS, " +
                " TEMPSINCREMENT, " +
                " AMBEVALUACIOELO, " +
                " ESTAT) " +
                " values ( " +
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
                        utils.sendJson(pResponse, [numAffectedRows]);
                    } else {
                        utils.sendJson(pResponse, []);
                    }
                }
        );
    });
}


function doCrearPosicioTauler(pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        var sql = " insert into POSICIOTAULER (" +
                " IDPARTIDA, " +
                " NUMJUGADA, " +
                " COLORULTIMAJUGADA, " +
                " POSICIO) " +
                " values ( " +
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
                        utils.sendJson(pResponse, [numAffectedRows]);
                    } else {
                        utils.sendJson(pResponse, []);
                    }
                }
        );
    });
}


function doUpdateResultatPartida(pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        var sql = " update PARTIDA " +
                " set ";
        var paramsInSql = [];
        sql += " RESULTAT = ? ";
        sql += " where ID = ? ";
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
                        utils.sendJson(pResponse, [numAffectedRows]);
                    } else {
                        utils.sendJson(pResponse, []);
                    }
                }
        );
    });
}


function doSelect(pTable, pRequest, pResponse) {
    utils.parseReceivedData(pRequest, function (pRow) {
        var sql = " select * from " + pTable.toUpperCase() +
                " where 1=1 ";
        var paramsInSql = [];
        for (var propertyName in pRow) {
            propertyName = propertyName.toUpperCase();
            sql += " and " + propertyName + "=? ";
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
                        utils.sendJson(pResponse, rows);
                    } else {
                        utils.sendJson(pResponse, []);
                    }
                }
        );
    });
}