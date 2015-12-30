		
		//EXEMPLE !!!!
		//ASSOCIAR OBJECTE A HTML ELEMENT !!!!
		
		var colorUsuari = "B";
		var f = new FitxaDades("TB1", TIPUS_FITXA_TORRE, COLOR_BLANC, colorUsuari, casella = obtenirPointCasella(colorUsuari, CASELLA_A1_B), iiJInArray = obtenirIiJDePointCasella(colorUsuari, casella), false);
	
	
		var allData = new WeakMap();
		allData.set(document.getElementById("TB1"), f); 
		
		var data1 = allData.get(document.getElementById("TB1")) || {};
		console.log(data1);
		
	
		/*
		associa objecte sense jQuery
		var fitxaDades = new WeakMap();
		var data1 = fitxaDades.get(document.getElementById("TB1")) || {}; // read
		data1.foo = "bar";
		fitxaDades.set(document.getElementById("TB1"), data1);            // write
		*/
	
		/*
		associa objecte amb jQuery
		$.data(document.getElementById("TB1"), "fitxaDades",f);
		var g = $.data(document.getElementById("TB1"), "fitxaDades");
		console.log(g.nom);
		*/