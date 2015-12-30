
/*per connectar a la bd root dins el SHELL:
SHELL>mysql --host=localhost --user=root --password=anderssenvsk12 escacsvdt
*/

/*per connectar a la bd escacsvdt dins el SHELL:
SHELL>mysql --host=localhost --user=escacsvdt --password=escacsvdt escacsvdt
*/

/*-------------------------------INICI executar des de BDVAIO-------------------------------*/
/*creem l'usuari escacsvdt*/
CREATE USER 'escacsvdt'@'%' IDENTIFIED BY 'escacsvdt';

/*aplicar privilegis a l'usuari escacsvdt*/
GRANT ALL PRIVILEGES ON *.* 
	TO 'escacsvdt'@'%' 
	IDENTIFIED BY 'escacsvdt' 
	WITH GRANT OPTION MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
FLUSH PRIVILEGES;
	
/*creem base de dades escacsvdt*/
CREATE DATABASE escacsvdt
  DEFAULT CHARACTER SET 'utf8'
  DEFAULT COLLATE 'utf8_general_ci';
/*--------------------------------FI executar des de BDVAIO--------------------------------*/

USE escacsvdt;

DROP TABLE IF EXISTS PARTIDA;
DROP TABLE IF EXISTS JUGADESOBERTURA;
DROP TABLE IF EXISTS JUGADESGRAELLA;
DROP TABLE IF EXISTS HISTORIALJUGADOR;
DROP TABLE IF EXISTS LOGS;
DROP TABLE IF EXISTS OBERTURA;
DROP TABLE IF EXISTS GRAELLA;
DROP TABLE IF EXISTS REPTE;
DROP TABLE IF EXISTS JUGADOR;


CREATE TABLE IF NOT EXISTS JUGADOR (  
  ID INT (3) NOT NULL AUTO_INCREMENT,
  NOM VARCHAR (50) NOT NULL,
  COGNOMS VARCHAR (100) NOT NULL,
  NICK VARCHAR (50) DEFAULT 'Invitat ' NOT NULL, /*si NO és del Club Escacs VDT, es dirà "Invitat X" (X depenent dels Invitats que hi hagi) */
  PASSWORD VARCHAR (10) DEFAULT 'demo' NOT NULL, /*si NO és del Club Escacs VDT, el password serà "demo"*/
  HORAULTIMLOGIN TIMESTAMP NOT NULL, 
  DIRECCIO VARCHAR (100),
  POBLACIO VARCHAR (50),
  CP VARCHAR (5),
  PROVINCIA VARCHAR (50),
  TELEFON VARCHAR (15),
  EMAIL VARCHAR (50),
  ACTIU INT (1) DEFAULT 0, /*si és 0, està de baixa*/
  PERFIL INT (1) DEFAULT 1, /*si és 1, és un jugador pertanyent a Club Escacs VDT, si és Invitat serà 0 !!!*/
  ELO INT (4) DEFAULT 0,
  IP VARCHAR (50),
  PORT VARCHAR (5),
  ESTAT INT (1) DEFAULT -1, /*desconnectat=-1, lliure=0, reptant=1, jugant=2*/
  PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


CREATE TABLE IF NOT EXISTS HISTORIALJUGADOR (
  ID INT (6) NOT NULL AUTO_INCREMENT,
  IDJUGADOR INT (3) NOT NULL,
  NUM_HISTORIAL INT (6) NOT NULL,
  HORALOGIN TIMESTAMP NOT NULL,
  ELO INT (4) NOT NULL,
  PRIMARY KEY (ID),
  FOREIGN KEY (IDJUGADOR) REFERENCES JUGADOR (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


CREATE TABLE IF NOT EXISTS GRAELLA (
  ID INT(6) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


CREATE TABLE IF NOT EXISTS JUGADESGRAELLA (
  ID INT (6) NOT NULL AUTO_INCREMENT,
  IDGRAELLA INT (6) NOT NULL,
  NUMJUGADA INT (3) NOT NULL,
  COLOR VARCHAR (1) NOT NULL,
  JUGADA VARCHAR (100) NOT NULL, /*es guarda l'anotació de la jugada en format HTML*/
  PRIMARY KEY (ID),
  FOREIGN KEY (IDGRAELLA) REFERENCES GRAELLA (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


CREATE TABLE IF NOT EXISTS OBERTURA (
  ID INT (3) NOT NULL AUTO_INCREMENT,
  NOM VARCHAR (100) NOT NULL,
  PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

  
CREATE TABLE IF NOT EXISTS JUGADESOBERTURA (
  ID INT (6) NOT NULL AUTO_INCREMENT,
  IDOBERTURA INT (3) NOT NULL,
  NUMJUGADA INT (3) NOT NULL,
  JUGADAORIGENBLANQUES VARCHAR (5) NOT NULL,
  JUGADAORDESTIBLANQUES VARCHAR (5) NOT NULL,
  JUGADAORIGENNEGRES VARCHAR (5) NOT NULL,
  JUGADADESTINEGRES VARCHAR (5) NOT NULL,
  PRIMARY KEY (ID),
  FOREIGN KEY (IDOBERTURA) REFERENCES OBERTURA (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


CREATE TABLE IF NOT EXISTS REPTE (
  ID INT (6) NOT NULL AUTO_INCREMENT,
  IDJUGADORREPTADOR INT (3) NOT NULL,
  IDJUGADORREPTAT INT (3),
  COLORJUGADORREPTADOR VARCHAR(1) NOT NULL,
  HORAINICI TIMESTAMP NOT NULL,
  TEMPS INT (6) NOT NULL, /*en segons!!!*/
  TEMPSINCREMENT INT (3) NOT NULL, /*en segons!!!*/
  AMBEVALUACIOELO INT (1) DEFAULT 0 NOT NULL, 
  ESTAT INT (1) DEFAULT 0 NOT NULL, /*cancel·lat=-1, pendent=0, acceptat=1*/
  DINSSALAJUGADORREPTADOR INT (1),
  DINSSALAJUGADORREPTAT INT (1),
  PRIMARY KEY (ID),
  FOREIGN KEY (IDJUGADORREPTADOR) REFERENCES JUGADOR (ID),
  FOREIGN KEY (IDJUGADORREPTAT) REFERENCES JUGADOR (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


CREATE TABLE IF NOT EXISTS PARTIDA (
  ID INT (6) NOT NULL AUTO_INCREMENT,
  IDREPTE INT (6) NOT NULL,
  IDJUGADORBLANQUES INT (3) NOT NULL,
  IDJUGADORNEGRES INT (3) NOT NULL,
  HORAINICI TIMESTAMP NOT NULL,
  TEMPS INT (6) NOT NULL, /*en segons!!!*/
  TEMPSINCREMENT INT (3) NOT NULL, /*en segons!!!*/
  AMBEVALUACIOELO INT (1) DEFAULT 0 NOT NULL,
  IDGRAELLA INT (6), 
  IDOBERTURA INT (3),
  ESTAT INT (1) DEFAULT 0 NOT NULL, /*cancel·lada=-1, jugant=0, ajornada=1, finalitzada=2*/
  RESULTAT INT (1), /*blanques=1, empat=2, negres=3*/
  PRIMARY KEY (ID),
  FOREIGN KEY (IDREPTE) REFERENCES REPTE (ID),
  FOREIGN KEY (IDJUGADORBLANQUES) REFERENCES JUGADOR (ID),
  FOREIGN KEY (IDJUGADORNEGRES) REFERENCES JUGADOR (ID),
  FOREIGN KEY (IDGRAELLA) REFERENCES GRAELLA (ID),
  FOREIGN KEY (IDOBERTURA) REFERENCES OBERTURA (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


CREATE TABLE IF NOT EXISTS POSICIOTAULER (
  ID INT (6) NOT NULL AUTO_INCREMENT,
  IDPARTIDA INT (6) NOT NULL,
  NUMJUGADA INT (3) NOT NULL,
  COLORULTIMAJUGADA VARCHAR(1) NOT NULL, /*posició després de realitzar la jugada del color*/
  POSICIO VARCHAR(1000) NOT NULL, /*guardem la posició de les peces al tauler, separat per ','*/
  PRIMARY KEY (ID),
  FOREIGN KEY (IDPARTIDA) REFERENCES PARTIDA (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;



insert into JUGADOR (nom, cognoms, nick, password) values ('Xavier', 'Masclans', 'xavier_masclans', 'xmasclans');
insert into JUGADOR (nom, cognoms, nick, password) values ('Àngel', 'Exojo', 'angel_exojo', 'aexojo');
insert into JUGADOR (nom, cognoms, nick, password) values ('David', 'Alcaraz', 'david_alcaraz', 'dalcaraz');
insert into JUGADOR (nom, cognoms, nick, password) values ('Jordi', 'Cervelló', 'jordi_cervello', 'jcervello');
insert into JUGADOR (nom, cognoms, nick, password) values ('Agustín', 'Fernández', 'agustin_fernandez', 'afernandez');
insert into JUGADOR (nom, cognoms, nick, password) values ('Arnau', 'Masclans', 'arnau_masclans', 'amasclans');
insert into JUGADOR (nom, cognoms, nick, password) values ('Àngel', 'Boixader', 'angelboixader', 'aboixader');
insert into JUGADOR (nom, cognoms, nick, password) values ('Enric', 'Folch', 'enric_folch', 'efolch');
insert into JUGADOR (nom, cognoms, nick, password) values ('Alfons', 'Nateras', 'alfonso_nateras', 'anateras');
insert into JUGADOR (nom, cognoms, nick, password) values ('Joaquim', 'Navajas', 'joaquim_navajas', 'jnavajas');
insert into JUGADOR (nom, cognoms, nick, password) values ('Joan', 'Turon', 'joan_turon', 'jturon');
insert into JUGADOR (nom, cognoms, nick, password) values ('Oriol', 'Torrillas', 'oriol_torrillas', 'otorrillas');
insert into JUGADOR (nom, cognoms, nick, password) values ('Óscar', 'Barroso', 'oscar_barroso', 'obarroso');
insert into JUGADOR (nom, cognoms, nick, password) values ('Dani', 'Fernández', 'dani_fernandez', 'dfernandez');
insert into JUGADOR (nom, cognoms, nick, password) values ('Gerard', 'Rius', 'gerard_rius', 'grius');
insert into JUGADOR (nom, cognoms, nick, password) values ('David', 'González', 'david_gonzalez', 'dgonzadez');
insert into JUGADOR (nom, cognoms, nick, password) values ('Aleix', 'Centelles', 'aleix_centelles', 'acentelles');
insert into JUGADOR (nom, cognoms, nick, password) values ('Pere', 'Castells', 'pere_castells', 'pcastells');
insert into JUGADOR (nom, cognoms, nick, password) values ('Francesc', 'Cordomí', 'francesc_cordomi', 'fcordomi');
insert into JUGADOR (nom, cognoms, nick, password) values ('Joan', 'Izquierdo', 'joan_izquierdo', 'jizquierdo');
insert into JUGADOR (nom, cognoms, nick, password) values ('Jordi', 'Casas', 'jordi_casas', 'jcasas');
insert into JUGADOR (nom, cognoms, nick, password) values ('Josep', 'Barea', 'josep_barea', 'jbarea');
insert into JUGADOR (nom, cognoms, nick, password) values ('Josep', 'Navajas', 'josep_navajas', 'jnavajas');
insert into JUGADOR (nom, cognoms, nick, password) values ('Raúl', 'Alfonso', 'raul_alfonso', 'ralfonso');
insert into JUGADOR (nom, cognoms, nick, password) values ('Josep', 'Guzmán', 'josep_guzman', 'jguzman');
insert into JUGADOR (nom, cognoms, nick, password) values ('Stefan', 'Alexandry', 'stefan_alexandry', 'salexandry');
insert into JUGADOR (nom, cognoms, nick, password) values ('Albert', 'Valls', 'albert_valls', 'avalls');
insert into JUGADOR (nom, cognoms, nick, password) values ('Isidre', 'Camprubí', 'isidre_camprubi', 'icamprubi');
insert into JUGADOR (nom, cognoms, nick, password) values ('Josep', 'Plantada', 'josep_plantada', 'jplantada');
insert into JUGADOR (nom, cognoms, nick, password) values ('Jordi', 'Salvany', 'jordi_salvany', 'jsalvany');
insert into JUGADOR (nom, cognoms, nick, password) values ('Pol', 'Méndez', 'pol_mendez', 'pmendez');
insert into JUGADOR (nom, cognoms, nick, password) values ('Mercè Montserrat', 'Oviedo', 'montserrat_oviedo', 'moviedo');
insert into JUGADOR (nom, cognoms, nick, password) values ('Artur', 'Salvany', 'artur_salvany', 'asalvany');
insert into JUGADOR (nom, cognoms, nick, password) values ('Enric', 'Vallejo', 'enric_vallejo', 'evallejo');
insert into JUGADOR (nom, cognoms, nick, password) values ('Ayoub', 'Elkhafi', 'ayoub_elkhafi', 'aelkhafi');
insert into JUGADOR (nom, cognoms, nick, password) values ('Antoni', 'Navajas', 'antoni_navajas', 'anavajas');
insert into JUGADOR (nom, cognoms, nick, password) values ('Ariadna', 'Alfonso', 'ariadna_alfonso', 'aalfonso');
insert into JUGADOR (nom, cognoms, nick, password) values ('Maria', 'Alfonso', 'maria_alfonso', 'malfonso');
insert into JUGADOR (nom, cognoms, nick, password) values ('Erika', 'García', 'erika_garcia', 'egarcia');
insert into JUGADOR (nom, cognoms, nick, password) values ('Arnau', 'González', 'arnau_gonzalez', 'agonzalez');
insert into JUGADOR (nom, cognoms, nick, password) values ('David', 'Cregut', 'cregut', 'cregut');
insert into JUGADOR (nom, cognoms, nick, password) values ('Pedro', 'García', 'pedro_garcia', 'pgarcia');
insert into JUGADOR (nom, cognoms, nick, password) values ('Alfonso', 'Chavero', 'alfonso_chavero', 'achavero');
insert into JUGADOR (nom, cognoms, nick, password) values ('Werner', 'Katz', 'werner_katz', 'wkatz');
insert into JUGADOR (nom, cognoms, nick, password) values ('Juan Manuel', 'Bouzas', 'juan_bouzas', 'jbouzas');