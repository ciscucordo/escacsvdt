


var opIsDone = false;

function sendHtml(pResponse, pHtml) {
	pResponse.setHeader("Content-Type", "text/html");
	pResponse.setHeader("Content-Length", Buffer.byteLength(pHtml));
	pResponse.end(pHtml);
}



function actionForm(pId, pPath, pLabel) {
	var html = "<form method='POST' action='"+pPath+"'>" +
	"<input type='hidden' name='id' value='"+pId+"'>" +
	"<input type='submit' value='" + pLabel + "' />" +
	"</form>";
	return html;
}



function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
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
function $waitUntil(check,onComplete,delay,timeout) {
  // if the check returns true, execute onComplete immediately
  if (check()) {
      onComplete();
      return;
  }
  
  if (!delay) delay=100;

  var timeoutPointer;
  var intervalPointer=setInterval(function () {
      if (!check()) return; // if check didn't return true, means we need another check in the next interval

      // if the check returned true, means we're done here. clear the interval and the timeout and execute onComplete
      clearInterval(intervalPointer);
      if (timeoutPointer) clearTimeout(timeoutPointer);
      onComplete();
  },delay);
  // if after timeout milliseconds function doesn't return true, abort
  if (timeout) timeoutPointer=setTimeout(function () {
      clearInterval(intervalPointer);
  },timeout);
}

/*function waitUntil(boolFn, callback, delay) {
	//"use strict";
    // if delay is undefined or is not an integer
    delay = (typeof (delay) === 'undefined' || isNaN(parseInt(delay, 10))) ? 100 : delay;
	
    setTimeout(function () {
		console.log("dins:", boolFn());
        (boolFn() === true) ? callback() : waitUntil(boolFn, callback, delay);
    }, delay);
}*/






function doSelect(pTable, pRequest, pResponse) {
	db.query(
		"SELECT * FROM " + pTable,
		function(err, rows) {
			if (err) {
				return false;
				//throw err;
			} else {
				return rows;
			}
		}
	);
	return false;
}

function doInsert(pTable, pRequest, pResponse) {
	parseReceivedData(pRequest, function(pRow) {
		//console.log("pepe.id:", pepe.id);
		db.query(
			"INSERT INTO obertura (id, nom) " +
			" VALUES (?, ?) ",
			[pRow.id, pRow.nom],
			function(err) {
				if (err) throw err;
			}
		);
	});
}

function doUpdate(pTable, pRequest, pResponse) {

}

function doDelete(pTable, pRequest, pResponse) {

}














exports.listenToMe = function(pRequest, pResponse) {
	
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
