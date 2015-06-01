angular.module('settingsModule', [])

.controller('SettingsCtrl', ['$scope', '$http', '$filter', 'dataService', 'activUser', 'ASCIIConverterService', function($scope, $http, $filter, dataService, activUser, ASCIIConverterService){
	
	$scope.beispielTabelle = [
	                          { rang: 1, mannschaft: "THW Kiel", begegnungen: 33, siege: 29, unentschieden: 1, niederlagen: 3, tore: "1010:776", verhaeltnis: 234, punkte: "59:7" },
	                          { rang: 2, mannschaft: "Rhein-Neckar Löwen", begegnungen: 31, siege: 26, unentschieden: 1, niederlagen: 4, tore: "927:757", verhaeltnis: 170, punkte: "53:9" },
	                          { rang: 3, mannschaft: "SG Flensburg-Handewit", begegnungen: 33, siege: 21, unentschieden: 6, niederlagen: 6, tore: "942:817", verhaeltnis: 125, punkte: "48:18" },
	                          { rang: 4, mannschaft: "SC Magdeburg", begegnungen: 32, siege: 22, unentschieden: 2, niederlagen: 8, tore: "957:870", verhaeltnis: 87, punkte: "46:18" },
	                          { rang: 5, mannschaft: "FRISCH AUF! Göppingen", begegnungen: 34, siege: 18, unentschieden: 4, niederlagen: 12, tore: "925:915", verhaeltnis: 10, punkte: "40:28" },
	                          { rang: 6, mannschaft: "Füchse Berlin", begegnungen: 32, siege: 17, unentschieden: 3, niederlagen: 12, tore: "884:884", verhaeltnis: 0, punkte: "37:27" },
	                          { rang: 7, mannschaft: "MT Melsungen", begegnungen: 33, siege: 16, unentschieden: 4, niederlagen: 13, tore: "979:915", verhaeltnis: 64, punkte: "36:30" },
	                          { rang: 8, mannschaft: "HSG Wetzlar", begegnungen: 34, siege: 13, unentschieden: 6, niederlagen: 15, tore: "908:901", verhaeltnis: 7, punkte: "32:36" },
	                          { rang: 9, mannschaft: "HSV Handball", begegnungen: 34, siege: 15, unentschieden: 2, niederlagen: 17, tore: "934:930", verhaeltnis: 4, punkte: "32:36" }
	                        ];
	
	$scope.ligenplanLink = "https://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/leaguePage?championship=Bremer+HV+14/15";
	
	var isEmpty = function (obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	};
	
	/**
	 * Initialisierung des Settings-Controllers
	 */
	$scope.initSettingsController = function() {
		$scope.benutzer = activUser.user;
		$scope.show = 'anzeigenManager';
		
		initDesignManager();
		initLigaManager();
	};
	
	
	
	//------------------------------------------------------------------------------------------------------------------
	//-----FUNKTIONEN FÜR DEN ANZEIGEN-MANAGER--------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------------
	
	/**
	 * Ändert den Status der aktiven Designs vom Benutzer
	 */
	$scope.changeDesignauswahl = function(designauswahl){
		if(designauswahl.first){
			$scope.benutzer.firstdesign = true;
		}
		else{
			$scope.benutzer.firstdesign = false;
		}
		
		if(designauswahl.second){
			$scope.benutzer.seconddesign = true;
		}
		else{
			$scope.benutzer.seconddesign = false;
		}
	};
	
	
	/**
	 * Ändert das Standarddesign vom Benutzer
	 */
	$scope.changeStandardDesign = function(standardDesign){
		
		$scope.benutzer.standardDesign = standardDesign;
		
	};
	
	
	/**
	 * Ändert ggf. das Standarddesign vom Benutzer bei Änderung der aktiven Designs
	 */
	$scope.changeFirstDesign = function() {
		if($scope.benutzer.first){
			$scope.benutzer.standardDesign = "1";
		}else{
			$scope.benutzer.standardDesign = "2";
		}
	};

	
	/**
	 * Ändert ggf. das Standarddesign vom Benutzer bei Änderung der aktiven Designs
	 */
	$scope.changeSecondDesign = function() {
		if($scope.benutzer.second){
			$scope.benutzer.standardDesign = "2";
		}else{
			$scope.benutzer.standardDesign = "1";
		}
	};
    

	/**
	 * Ändert den Status des favorisierten Vereins vom Benutzer
	 */
	$scope.changeFavorisierterVerein = function(vereinsname){
		$scope.benutzer.favoritVerein = vereinsname;
	};
	
	
	/**
	 * Ändert den Status des Spielplans vom Benutzer
	 */
	$scope.changeSpielplan = function(spielplan){

		$scope.benutzer.spielplan = spielplan;

	};
	
	
	/**
	 * Ändert den Status der Loginmöglichkeit vom Benutzer
	 */
	$scope.changeLogin = function(verwaltung){

		$scope.benutzer.verwaltung = verwaltung;
			
	};
	
	
	
	//------------------------------------------------------------------------------------------------------------------
	//-----FUNKTIONEN FÜR DEN DESIGN-MANAGER----------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------------
	
	/**
	 * Initialisiert den Design-Manager
	 */
	var initDesignManager = function(){
		//Vordefinierte Designs werden initialisiert
		initTableDesigns();
		
		//Übernahme des Designs vom Benutzer
		$scope.tableDesign = dataService.tableDesign;
		
		//Sollte kein Design vorhanden sein wird das erste Design als Standard-Design eingerichtet
		if(isEmpty($scope.tableDesign)){
			$scope.changeTableDesign($scope.tableDesign1);
		}
	};
	
	
	/**
	 * Initialiserung der Standarddesigns des Programms
	 */
	var initTableDesigns = function(){
		$scope.tableDesign1 = createTableDesign("#030094", "#ffffff", "#ffffff", "#000000", true, "#cccccc", "#000000", "#9ca0ff", false);
		$scope.tableDesign2 = createTableDesign("#030094", "#ffffff", "#ffffff", "#000000", true, "#cccccc", "#000000", "#9ca0ff", false);
		$scope.tableDesign3 = createTableDesign("#030094", "#ffffff", "#ffffff", "#000000", true, "#cccccc", "#000000", "#9ca0ff", false);
	};
	
	
	/**
	 * Funktion liefert ein gefertigtes Design zurück
	 */
	var createTableDesign = function(backgroundColorHeader, textColorHeader, backgroundColor, textColor, tableStriped, stripedColor, captionColor, highlightColor, tableBordered){
		var tableDesign = new Object();
		tableDesign.backgroundColorHeader = backgroundColorHeader;
		tableDesign.textColorHeader = textColorHeader;
		tableDesign.backgroundColor = backgroundColor;
		tableDesign.textColor = textColor;
		tableDesign.tableStriped = tableStriped;
		tableDesign.stripedColor = stripedColor;
		tableDesign.captionColor =captionColor;
		tableDesign.highlightColor = highlightColor;
		tableDesign.tableBordered = tableBordered;
		
		return tableDesign;
	};
	
	
	/**
	 * Ändert das Design in ein anderes Design
	 */
	$scope.changeTableDesign = function(design){
		$scope.tableDesign.backgroundColorHeader = design.backgroundColorHeader;
		$scope.tableDesign.textColorHeader = design.textColorHeader;
		$scope.tableDesign.backgroundColor = design.backgroundColor;
		$scope.tableDesign.textColor = design.textColor;
		$scope.tableDesign.tableStriped = design.tableStriped;
		$scope.tableDesign.stripedColor = design.stripedColor;
		$scope.tableDesign.captionColor = design.captionColor;
		$scope.tableDesign.highlightColor = design.highlightColor;
		$scope.tableDesign.tableBordered = design.tableBordered;
	};
	
	
	
	//------------------------------------------------------------------------------------------------------------------
	//-----FUNKTIONEN FÜR DEN LIGA-MANAGER------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------------
	
	/**
	 * Initialisiert Variablen für den Liga-Manager
	 */
	var initLigaManager = function() {
		$scope.leagues = dataService.leagues;
		$scope.jugenden = $filter('listGroupBy')( $scope.leagues, 'jugend');
		
		$scope.activeLeagues = $filter('filter')($scope.leagues, {isActiv: 'true'});
		$scope.activJugenden =  $filter('listGroupBy')( $scope.activeLeagues, 'jugend');
		
		$scope.favorit = $scope.benutzer.favorit;
		
		$scope.progressbaraktuell = 0;
		$scope.progressbaraktuellprozent = 0;
	};
	
	
	/**
	 * Überprüft ob Liga-Daten schon vorliegen und aktiviert bei Fund das PopUp-Fenster für den Update-Hinweis
	 */
	$scope.checkLigaData = function(data){
		if(isEmpty(data)){
			$scope.getAllLeagues($scope.ligenplanLink);
		}
		else{
			$scope.showUpdate = true;
		}
	}
	
	
	/**
	 * Ein PopUp-Fenster wird aktiviert mit dem Hinweis zum Löschen der Liga
	 */
	$scope.showDeleteModal = function(league){
		$scope.showDelete = true;
		$scope.deleteLeague = league;
	}

	
	$scope.getAllLeagues = function(ligenplanLink) {

		$scope.benutzer.favoritLeague = null;
		$scope.quelle = false;
		$scope.leagues = null;
		$scope.jugenden = null;
		$scope.loading = true;
		
		ligenplanLink = ASCIIConverterService.convert(ligenplanLink);
		
		var jsonFeed = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + ligenplanLink + "%22%20and%20xpath%3D%22%2F%2Ftable%2F%2Ftr%2F%2Ftd%2F%2Ful%2F%2Fli%2F%2Fspan%2F%2Fa%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

		$http.get(jsonFeed).success(function (data) {
			
			var leagues = new Array();

			var daten = data.query.results.a;
		    	for(var i = 0; i < daten.length; i++){
		    		
		    		var leagueData = daten[i];
		    		var league = new Object();
		    		var namensnennung = leagueData.content;
		        
		    		league.id = i;
		        
			        if(namensnennung.indexOf("MJ") !== -1){
			        	league.gender = "Männlich";
			        	league.jugend = "Männliche " + namensnennung.substr(namensnennung.indexOf("MJ")+2, 1) + "-Jugend";
			        	namensnennung = namensnennung.replace(" MJ"+namensnennung.substr(namensnennung.indexOf("MJ")+2, 1), "");
			        }
			        else if(leagueData.content.indexOf("WJ") !== -1){
			        	league.gender = "Weiblich";
			        	league.jugend = "Weibliche " + namensnennung.substr(namensnennung.indexOf("WJ")+2, 1) + "-Jugend";
			        	namensnennung = namensnennung.replace(" WJ"+namensnennung.substr(namensnennung.indexOf("WJ")+2, 1), "");
			        }
			        else if(namensnennung.indexOf(" M") !== -1){
			        	league.gender = "Männlich";
			        	league.jugend = "Herren";
			        	namensnennung = namensnennung.replace(" M", "");
			        }
			        else if(namensnennung.indexOf(" F") !== -1){
			        	league.gender = "Weiblich";
			        	league.jugend = "Damen";
			        	namensnennung = namensnennung.replace(" F", "");
			        }
			        else{
			        	league.gender = "undefined";
			        	league.jugend = "undefined";
			        }
			        
			        league.name = namensnennung;
			        league.specialName = "";
			        league.linkage = "https://bremerhv-handball.liga.nu" + leagueData.href;
			        league.isActiv = false;
			        league.notePosLeft = Math.random()*40 + '%'; // Initialwert
			        league.notePosTop = Math.random()*80 + '%'; // Initialwert
			        			       
			        leagues.push(league);
		    	}

		    	$scope.loading = false;
		    	
		    	dataService.leagues = leagues;
		    	initLigaManager();
		    	
		});
	};
	
	
	/**
	 * Ändert den Status der favorisierten Liga vom Benutzer
	 */
	$scope.changeFavorit = function(league){
		$scope.benutzer.favoritLeague = league;
	};
	
	
	/**
	 * Überprüft wie sich der Suche-Button verhalten muss und aktiviert die dazugehörige Funktion
	 */
	$scope.checkSearchVerein = function(){
		//Aktiviert das Suchfeld für den Eintrag
		if(!$scope.search && !$scope.searchStart){
			$scope.search = true;
		}
		//Eintrag ins Suchfeld ist erfolgt und Suche wird gestartet
		else if($scope.searchVerein  && !$scope.searchStart){
			$scope.search = false;
			$scope.searchStart = true;
			findAllLeaguesOfVerein($scope.searchVerein);
		}
		//Deaktivierung des Suchfelds
		else{
			$scope.search = false;
		}
	};
	

	/**
	 * Überprüft sämtliche Ligen auf Vereinsstimmigkeit
	 */
	var findAllLeaguesOfVerein = function (verein){
		var leagues = $scope.leagues;
		$scope.anzahlSearch = 0;
		
		for(var i=0; i<leagues.length; i++){
			checkIfVereinInLeague(leagues[i], verein);
		}
	};
	
	/**
	 * Überprüft in der Liga, ob sich der Verein darin aufhält & aktiviert die Liga bei Fund
	 */
	var checkIfVereinInLeague = function(league, verein) {
		
		var adresse = league.linkage;

	    adresse = adresse.replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');

	    var jsonFeed ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+adresse+"%22%20and%20xpath%3D%22%2F%2Ftable%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

	    $http.get(jsonFeed).success(function (data) {
	      
	      var mannschaften = new Array();

	      try{
		      var daten = data.query.results.table[0].tbody.tr;
	
		      for(var i = 1; i < daten.length; i++){
		        var mannschaftsdaten = daten[i].td;
		        var mannschaft = new Object();
		        if (typeof mannschaftsdaten[2].a !== "undefined"){
		        	mannschaft = mannschaftsdaten[2].a.content;
		        }else{
		        	mannschaft = mannschaftsdaten[2].content;
		        }
		        mannschaften.push(mannschaft);
		      }
	
		      var found = false;
		      var j=0;
		      while(j < mannschaften.length && !found){
				if(mannschaften[j].indexOf(verein) > -1){
					$scope.addActivLeague(league);
					addActivLeague(league);
					$scope.anzahlSearch = $scope.anzahlSearch + 1;
					found = true;
				}
				j++;
		      }
	      }catch (e) {
			// TODO: handle exception
		}
	      
	      $scope.progressbaraktuell = $scope.progressbaraktuell + 1;
	      $scope.progressbaraktuellprozent = (($scope.progressbaraktuell / $scope.leagues.length) * 100);
	      
	      if( $scope.progressbaraktuellprozent === 100){
	    	  $scope.searchStart = false;
	    	  $scope.progressbaraktuell = 0;
	    	  $scope.progressbaraktuellprozent = 0;
	      }
	    });
	  };
	
	  
	  /**
	   * Ändert den Status der Liga ins Gegenteil von dem was ist vorher gewesen ist
	   */
	  $scope.changeActiv = function(league) {
		  if(league.isActiv){
			  deleteActivLeague(league);
		  }
		  else{
			  addActivLeague(league);
		  }
	  };
	  
	  var addActivLeague = function(league) {
		  league.isActiv = true;
		  $scope.activeLeagues = $filter('filter')($scope.leagues, {isActiv: 'true'});
		  $scope.activJugenden =  $filter('listGroupBy')( $scope.activeLeagues, 'jugend');
		  
		  if(isEmpty($scope.benutzer.favoritLeague)){
			  $scope.changeFavorit($scope.activeLeagues[0]);
		  }
		  
		  dataService.leagues = $scope.leagues;
	  };
	  
	  var deleteActivLeague = function(league) {
		  league.isActiv = false;
		  $scope.activeLeagues = $filter('filter')($scope.leagues, {isActiv: 'true'});
		  $scope.activJugenden =  $filter('listGroupBy')( $scope.activeLeagues, 'jugend');
		  
		  if($scope.benutzer.favoritLeague === league){
			  $scope.changeFavorit($scope.activeLeagues[0]);
		  }
		  
		  dataService.leagues = $scope.leagues;
	  };
	  
	  $scope.changeSpecialName = function(league, specialName) {
		  league.specialName = specialName;
	  };
	  
	  /**
	   * Dient zum Kontrollieren des Controllers innerhalb einer Directive
	   */
	  $scope.focusinControl = {
	  };
	  
}]);