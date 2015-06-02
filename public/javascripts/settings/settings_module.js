/**
 * Enthält Controller, Services, Direktiven etc. für die Manager/Einstellungen des Tabellenadministrationstools
 */

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
		//$scope.benutzer = activUser.user;
		$scope.settings = activUser.user.settings;
		
		initAnzeigeManager();
		initDesignManager();
		initLigaManager();
		$scope.show = 'anzeigenManager';
	};
	
	
	
	//------------------------------------------------------------------------------------------------------------------
	//-----FUNKTIONEN FÜR DEN ANZEIGEN-MANAGER--------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------------
	
	var initAnzeigeManager = function(){
		$scope.anzeige = $scope.settings.anzeige;
	};
	
	/**
	 * Ändert den Status der aktiven Designs vom Benutzer
	 */
	$scope.changeDesignauswahl = function(designauswahl){
		if(designauswahl.firstdesign){
			$scope.anzeige.designauswahl.firstdesign = true;
		}
		else{
			$scope.anzeige.designauswahl.firstdesign = false;
		}
		
		if(designauswahl.seconddesign){
			$scope.anzeige.designauswahl.seconddesign = true;
		}
		else{
			$scope.anzeige.designauswahl.seconddesign = false;
		}
	};
	
	
	/**
	 * Ändert das Standarddesign vom Benutzer
	 */
	$scope.changeStandardDesign = function(standardDesign){
		
		$scope.anzeige.standardDesign = standardDesign;
		
	};
	
	
	/**
	 * Ändert ggf. das Standarddesign vom Benutzer bei Änderung der aktiven Designs
	 */
	$scope.changeFirstDesign = function() {
		if($scope.anzeige.designauswahl.firstdesign){
			$scope.anzeige.standardDesign = "1";
		}else{
			$scope.anzeige.standardDesign = "2";
		}
	};

	
	/**
	 * Ändert ggf. das Standarddesign vom Benutzer bei Änderung der aktiven Designs
	 */
	$scope.changeSecondDesign = function() {
		if($scope.anzeige.designauswahl.seconddesign){
			$scope.anzeige.standardDesign = "2";
		}else{
			$scope.anzeige.standardDesign = "1";
		}
	};
    

	/**
	 * Ändert den Status des favorisierten Vereins vom Benutzer
	 */
	$scope.changeFavorisierterVerein = function(vereinsname){
		$scope.anzeige.favoritVerein = vereinsname;
	};
	
	
	/**
	 * Ändert den Status des Spielplans vom Benutzer
	 */
	$scope.changeSpielplan = function(spielplan){

		$scope.anzeige.spielplan = spielplan;

	};
	
	
	/**
	 * Ändert den Status der Loginmöglichkeit vom Benutzer
	 */
	$scope.changeLogin = function(verwaltung){

		$scope.anzeige.verwaltung = verwaltung;
			
	};
	
	
	
	//------------------------------------------------------------------------------------------------------------------
	//-----FUNKTIONEN FÜR DEN DESIGN-MANAGER----------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------------
	
	/**
	 * Initialisiert den Design-Manager
	 */
	var initDesignManager = function(){
		
		$scope.design = $scope.settings.design;
		
		//Vordefinierte Designs werden initialisiert
		initTableDesigns();
		
		//Übernahme des Designs vom Benutzer
		$scope.tableDesign = $scope.design.tableDesign;
		
	};
	
	
	/**
	 * Initialiserung der Standarddesigns des Programms
	 */
	var initTableDesigns = function(){
		$scope.tableDesign1 = createTableDesign("#030094", "#ffffff", "#ffffff", "#000000", true, "#cccccc", "#000000", "#9ca0ff", false);
		$scope.tableDesign2 = createTableDesign("#238c4e", "#ffffff", "#ffffff", "#000000", true, "#cccccc", "#000000", "#9ca0ff", false);
		$scope.tableDesign3 = createTableDesign("#a11515", "#ffffff", "#ffffff", "#000000", true, "#cccccc", "#000000", "#9ca0ff", false);
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
		$scope.liga = $scope.settings.liga;
		$scope.leagues = $scope.liga.leagues;
		
		$scope.jugenden = $filter('listGroupBy')( $scope.leagues, 'jugend');	
		$scope.activeLeagues = $filter('filter')($scope.leagues, {isActiv: 'true'});
		$scope.activJugenden = $filter('listGroupBy')( $scope.activeLeagues, 'jugend');
		
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

		$scope.favoritLeague = null;
		$scope.quelle = false;
		$scope.leagues = null;
		$scope.jugenden = null;
		$scope.loading = true;
		
		first = ligenplanLink.indexOf("/");
		second = ligenplanLink.indexOf("/", first + 1);
		third = ligenplanLink.indexOf("/", second + 1);
		hauptSeite = ligenplanLink.substring(0, third);
		ligenplanLink = ASCIIConverterService.convert(ligenplanLink);
		
		var jsonFeed = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + ligenplanLink + "%22%20and%20xpath%3D%22%2F%2Ftable%2F%2Ftr%2F%2Ftd%22&format=xml&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
		

		$http.get(jsonFeed).success(function (data) {
			
			var leagues = new Array();

			var gruppen = new Array();
			
			var res = String.fromCharCode(13);
			
//			enter = '\u23CE';
//			enter2 = '\u21b5';
//			
//			console.log("test" + enter + "test");
//			console.log("test" + enter2 + "test");
			
			var res = data.split("  ");
			
			for(var i = 0; i < res.length; i++){
				if(res[i] == ''){
					res.splice(i, 1);
					i--;
				}
			}
			
			
			var jugend;
			var gender;
			for(var i=0; i < res.length; i++){
				//Suche nach Jugendgruppe
				if(res[i].indexOf("<h2>") != -1){
					
					//JUGENDGRUPPE-FILTERN
					help = res[i].substr(res[i].indexOf(">")+1);
					jugend = help.substr(0, help.indexOf("<"));
					
					//GENDER-SUCHEN
					if(jugend.indexOf("Männer") != -1){
						gender = "Männlich";
					}
					else if(jugend.indexOf("männl") != -1){
						gender = "Männlich";
					}
					else if(jugend.indexOf("Frauen") != -1){
						gender = "Weiblich";
					}
					else if(jugend.indexOf("weib") != -1){
						gender = "Weiblich";
					}
					else{
						gender = "Undefined";
					}
				
				}
				
				//Suche nach Liga
				else if(res[i].indexOf("<a href=") != -1){
					help = res[i].substr(res[i].indexOf("/"));
					link = help.substr(0, help.indexOf(">")-1);
					link = link.replace("amp;", "");
					
					help = help.substr(help.indexOf(">")+1);
					benennung = help.substr(0, help.indexOf("<"));

					league = new Object();
					league.id = leagues.length+1;
					league.gender = gender;
					league.jugend = jugend;
					league.name = benennung;
					league.linkage = hauptSeite + link;
					league.specialName = "";
			        league.isActiv = false;
			        league.notePosLeft = (league.id % 3) * 20 + '%'; // Initialwert
			        league.notePosTop = 1 * 80 + '%'; // Initialwert (25 eig schöner, aber die ID der allerletzten Liga ist sehr groß)
				        			       
					leagues.push(league);
				}
			}

	    	$scope.loading = false;
	    	
	    	$scope.settings.liga.leagues = leagues;
	    	initLigaManager();	
		    	
		});
	};
	
	
	/**
	 * Ändert den Status der favorisierten Liga vom Benutzer
	 */
	$scope.changeFavorit = function(league){
		$scope.settings.liga.favoritLeague = league;
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
			$scope.changeFavorisierterVerein($scope.searchVerein);
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
				if(mannschaften[j].toLowerCase().indexOf(verein.toLowerCase()) > -1){
					league.isActiv = true;
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
		  
		  if(isEmpty($scope.liga.favoritLeague)){
			  $scope.changeFavorit($scope.activeLeagues[0]);
		  }
		  
		  activUser.user.settings.liga.leagues = $scope.leagues;
	  };
	  
	  var deleteActivLeague = function(league) {
		  league.isActiv = false;
		  $scope.activeLeagues = $filter('filter')($scope.leagues, {isActiv: 'true'});
		  $scope.activJugenden =  $filter('listGroupBy')( $scope.activeLeagues, 'jugend');
		  
		  if($scope.liga.favoritLeague === league){
			  $scope.changeFavorit($scope.activeLeagues[0]);
		  }
		  
		  activUser.user.settings.liga.leagues = $scope.leagues;
	  };
	  
	  $scope.changeSpecialName = function(league, specialName) {
		  league.specialName = specialName;
	  };
	  
	  /**
	   * Dient zum Kontrollieren des Controllers innerhalb einer Directive
	   */
	  $scope.focusinControl = {
	  };
	  $scope.focusinControl2 = {
	  };
	  
}])



/**
 * Wandelt ASCII-Zeichen in entsprechende URL-Codes um
 */
.service('ASCIIConverterService', function(){
    
    this.convert = function(text) {
    	var text = text.replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');
    	return text; 
    };

});