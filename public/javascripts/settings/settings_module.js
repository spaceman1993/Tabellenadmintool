/**
 * Enthält Controller, Services, Direktiven etc. für die Manager/Einstellungen des Tabellenadministrationstools
 */

angular.module('settingsModule', [])


/**
 * AngularJS-Routing-Konfiguration für die Settings-Seite
 */
.config(['$stateProvider', function($stateProvider){
	$stateProvider
		.state('settings', {
			url: '/settings',
			views: {
				// Settings-Hauptseite in den Main-Container der index.ejs
				'main' : {
					templateUrl: './templates/settings/settings.html',
					controller: 'SettingsCtrl'
				},
				// Settings-Inhalte in die Settings-Hauptseite
				'anzeigenmanager@settings' : {
					templateUrl: 'templates/settings/anzeigenmanager.html'
				},
				'designmanager@settings' : {
					templateUrl: 'templates/settings/designmanager.html'
				},
				'ligamanager@settings' : {
					templateUrl: 'templates/settings/ligamanager.html'
				}
			}
		});
}])

/**
 * Der Controller des SettingsModule der für die Aktionen der Settings zuständig ist
 */
.controller('SettingsCtrl', ['$scope', '$http', '$filter', 'benutzerFactory', 'activUser', 'ASCIIConverterService', function($scope, $http, $filter, benutzerFactory, activUser, ASCIIConverterService){
	
	//Enthält Beispieldatensätze für die Tabelle im Design-Manager zur Veranschaulichung des gewählten Designs
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
	
	/**
     * Überprüft ob ein Objekt leer ist
     * 
     * @params: obj -> Zu überprüfende Objekt
     * 
     * @return: true 	-> Objekt ist leer
     * 			false	-> Objekt ist gefüllt
     */
	var isEmpty = function (obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key)){
	            return false;
	        }
	    }
	    return true;
	};
	
	
	$scope.updateSettings = function(){
		benutzerFactory.updateUserByName({"name":activUser.user.name, "settings": $scope.settings}, function(user) {
    		
    	});
	};
	
	/**
	 * Initialisierung des Settings-Controllers
	 */
	$scope.initSettingsController = function() {
		//Übernahme der Setting-Einstellungen des aktiven Benutzers
		$scope.settings = activUser.user.settings;
		
		//Initialisierung der einzelnen Manager
		initAnzeigeManager();
		initDesignManager();
		initLigaManager();
		
		//Bestimmt beim Aufruf der Settings, welcher Manager als erstes immer angezeigt wird
		$scope.show = 'anzeigenManager';
	};
	
	
	
	//------------------------------------------------------------------------------------------------------------------
	//-----FUNKTIONEN FÜR DEN ANZEIGEN-MANAGER--------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------------
	
	/**
	 * Initialiert den Anzeigen-Manager
	 */
	var initAnzeigeManager = function(){
		$scope.anzeige = $scope.settings.anzeige;
	};
	
	/**
	 * Ändert den Status der aktiven Designs vom Benutzer
	 * 
	 * @params: designauswahl -> 	Objekt in dem die beiden 
	 * 								Design-Einstellungen vorhanden sind
	 */
	$scope.changeDesignauswahl = function(designauswahl){
		//Bestimmung ob 1.Design aktiv ist
		if(designauswahl.firstdesign){
			$scope.anzeige.designauswahl.firstdesign = true;
		}
		else{
			$scope.anzeige.designauswahl.firstdesign = false;
		}
		
		//Bestimmung ob 2.Design aktiv ist
		if(designauswahl.seconddesign){
			$scope.anzeige.designauswahl.seconddesign = true;
		}
		else{
			$scope.anzeige.designauswahl.seconddesign = false;
		}
		
		$scope.updateSettings();
	};
	
	
	/**
	 * Ändert das Standarddesign vom Benutzer
	 * 
	 * @params: standardDesign -> Angabe des Designs, das Standard werden soll
	 */
	$scope.changeStandardDesign = function(standardDesign){
		
		$scope.anzeige.standardDesign = standardDesign;
		
		$scope.updateSettings();
	};
	
	
	/**
	 * Ändert ggf. das Standarddesign vom Benutzer bei Änderung der aktiven Designs
	 */
	$scope.changeFirstDesign = function() {
		//Bei Aktivierung des 1.Designs wird dieses als neues Standarddesign festgelegt
		if($scope.anzeige.designauswahl.firstdesign){
			$scope.anzeige.standardDesign = "1";
		//Bei Deaktivierung wird das 2.Design als neues Standarddesign festgelegt
		}else{
			$scope.anzeige.standardDesign = "2";
		}
		
		$scope.updateSettings();
	};

	
	/**
	 * Ändert ggf. das Standarddesign vom Benutzer bei Änderung der aktiven Designs
	 */
	$scope.changeSecondDesign = function() {
		//Bei Aktivierung des 2.Designs wird dieses als neues Standarddesign festgelegt
		if($scope.anzeige.designauswahl.seconddesign){
			$scope.anzeige.standardDesign = "2";
		}
		//Bei Deaktivierung wird das 1.Design als neues Standarddesign festgelegt
		else{
			$scope.anzeige.standardDesign = "1";
		}
		
		$scope.updateSettings();
	};
    

	/**
	 * Ändert den Status des favorisierten Vereins vom Benutzer
	 * 
	 * @params: vereinname -> Vereinsname der favorisiert werden soll
	 */
	$scope.changeFavorisierterVerein = function(vereinsname){
		$scope.anzeige.favoritVerein = vereinsname;
		
		$scope.updateSettings();
	};
	
	
	/**
	 * Ändert den Status des Anzeigen des Spielplans vom Benutzer
	 * 
	 * @params: spielplan -> 	true:  Spielplan wird angezeigt
	 * 							false: Spielplan wird nicht angezeigt
	 */
	$scope.changeSpielplan = function(spielplan){

		$scope.anzeige.spielplan = spielplan;

		$scope.updateSettings();
	};
	
	
	/**
	 * Ändert den Status der Loginmöglichkeit vom Benutzer
	 * 
	 * @params: verwlatung -> 	true:  Loginmöglichkeit wird gegeben
	 * 							false:  Loginmöglichkeit wird nicht gegeben
	 */
	$scope.changeLogin = function(verwaltung){

		$scope.anzeige.verwaltung = verwaltung;
		$scope.updateSettings();
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
		initApplicationDesigns();
		initTableDesigns();
		
		//Übernahme des Designs vom Benutzer
		$scope.applicationDesign = $scope.settings.design.applicationDesign;
		$scope.tableDesign = $scope.design.tableDesign;
		
	};
	
	
	/**
	 * Initialisierung der Standarddesigns des Programms
	 */
	var initApplicationDesigns = function(){
		$scope.applicationDesign1 = createApplicationDesign("#CB8C1D", 20, "#030094", "#FFFFFF", "#F2EFE4", "#000000", "#ff0000");
		$scope.applicationDesign2 = createApplicationDesign("#CB8C1D", 20, "#238c4e", "#FFFFFF", "#F2EFE4", "#000000", "#0600ff");
		$scope.applicationDesign3 = createApplicationDesign("#CB8C1D", 20, "#a11515", "#FFFFFF", "#F2EFE4", "#000000", "#000000");
	};
	
	
	/**
	 * Initialisierung der Standarddesigns des Programms
	 */
	var initTableDesigns = function(){
		$scope.tableDesign1 = createTableDesign("#030094", "#ffffff", "#ffffff", "#000000", true, "#cccccc", "#000000", "#9ca0ff", false);
		$scope.tableDesign2 = createTableDesign("#238c4e", "#ffffff", "#ffffff", "#000000", true, "#cccccc", "#000000", "#9cffa0", false);
		$scope.tableDesign3 = createTableDesign("#a11515", "#ffffff", "#ffffff", "#000000", true, "#cccccc", "#000000", "#ff9ca0", false);
	};
	
	/**
	 * Erzeugt ein Applicationdesign-Objekt
	 * 
	 * @params:	
	 * 			
	 * @return: Applicationdesign-Objekt
	 */
	var createApplicationDesign = function(backgroundColor, abstandRand, backgroundColorHeaderFooter, textColorHeaderFooter, backgroundColorBody, textColorBody, actionColor){
		var applicationDesign = {};
		applicationDesign.backgroundColor = backgroundColor;
		applicationDesign.abstandRand = abstandRand;
		
		applicationDesign.backgroundColorHeaderFooter = backgroundColorHeaderFooter;
		applicationDesign.textColorHeaderFooter = textColorHeaderFooter;
		
		applicationDesign.backgroundColorBody = backgroundColorBody;
		applicationDesign.textColorBody = textColorBody;
		applicationDesign.actionColor = actionColor;

		
		return applicationDesign;
	};
	
	
	/**
	 * Erzeugt ein Tabellendesign-Objekt
	 * 
	 * @params:	backgroundColorHeader	->	Hintergrundfarbe der Überschriftszeile
	 * 			textColorHeader			->	Textfarbe der Überschrift
	 * 			backgroundColor			->	Hintergrundfarbe der Tabelle
	 * 			textColor				->	Textfarbe der Tabelle
	 * 			tableStriped			->	true:  Tabelle wir farblich gestreift
	 * 										false: Tabelle wird einfarbig dargestellt
	 * 			stripedColor			->	Hintergrundfarbe der Streifung
	 * 			captionColor			->	Textfarbe der Tabellenbenennung
	 * 			highlightColor			->	Hintergrundfarbe der hervorgehobenen Zeile
	 * 			tableBordered			->	true: Tabelle wird mit Umrahmt
	 * 										false: Tabelle wird ohne Rahmen dargestellt
	 * 			
	 * @return: Tabellendesign-Objekt
	 */
	var createTableDesign = function(backgroundColorHeader, textColorHeader, backgroundColor, textColor, tableStriped, stripedColor, captionColor, highlightColor, tableBordered){
		var tableDesign = {};
		tableDesign.backgroundColorHeader = backgroundColorHeader;
		tableDesign.textColorHeader = textColorHeader;
		tableDesign.backgroundColor = backgroundColor;
		tableDesign.textColor = textColor;
		tableDesign.tableStriped = tableStriped;
		tableDesign.stripedColor = stripedColor;
		tableDesign.captionColor = captionColor;
		tableDesign.highlightColor = highlightColor;
		tableDesign.tableBordered = tableBordered;
		
		return tableDesign;
	};
	
	
	/**
	 * Ändert das Design in ein anderes Design
	 * 
	 * @params:	design -> Das TabellenDesign-Objekt, das übernommen werden soll
	 */
	$scope.changeApplicationDesign = function(design){
		$scope.applicationDesign.backgroundColor = design.backgroundColor;
		$scope.applicationDesign.abstandRand = design.abstandRand;
		
		$scope.applicationDesign.backgroundColorHeaderFooter = design.backgroundColorHeaderFooter;
		$scope.applicationDesign.textColorHeaderFooter = design.textColorHeaderFooter;
		
		$scope.applicationDesign.backgroundColorBody = design.backgroundColorBody;
		$scope.applicationDesign.textColorBody = design.textColorBody;
		$scope.applicationDesign.actionColor = design.actionColor;
		
		$scope.updateSettings();
	};
	
	
	/**
	 * Ändert das Design in ein anderes Design
	 * 
	 * @params:	design -> Das TabellenDesign-Objekt, das übernommen werden soll
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
		
		$scope.updateSettings();
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
		$scope.favoritLeague = $scope.liga.favoritLeague;
		
		//Tabellen werden gruppiert nach Jugenden zur besseren Übersicht über die Ligen
		$scope.jugenden = $filter('listGroupBy')( $scope.leagues, 'jugend');	
		
		//Aktive Ligen werden herausselektiert
		$scope.activeLeagues = $filter('filter')($scope.leagues, {isActiv: 'true'});
		//Aktive Ligen werden gruppiert nach Jugenden zur besseren Übersicht über die aktiven Ligen
		$scope.activJugenden = $filter('listGroupBy')( $scope.activeLeagues, 'jugend');
		
		$scope.liga.ligenplanLink = "https://bremerhv-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/leaguePage?championship=Bremer+HV+14/15";
		
		//Variablen Initialisierung für die automatische Suche nach den Vereinen
		$scope.progressbaraktuell = 0;
		$scope.progressbaraktuellprozent = 0;
	};
	
	/**
	 * Erzeugt eine Fehlermeldung, dass der angegebene Ligaplan-Link ungültig zu schein sein
	 */
	var isLigaDataError = function(){
		$scope.error = true;
	};
	
	
	$scope.refresh = function(){
		$scope.jugenden = new Array();
	}
	
	
	/**
	 * Überprüft ob Liga-Daten vorliegen und aktiviert bei Fund das PopUp-Fenster für den Update-Hinweis
	 * Sonst direkte suche nach den Ligen
	 * 
	 * @param data -> Ligenplan-Link aus dem die Ligen hervorgehen
	 */
	$scope.checkLigaData = function(data){
		
		if(isEmpty(data)){
			//Überprüfung, ob Link eine LeaguePage ist, wenn nicht dann Error
			if($scope.liga.ligenplanLink.indexOf("leaguePage") !== -1){
				$scope.error = null;
				$scope.jugenden = [];
				$scope.getAllLeagues($scope.liga.ligenplanLink);
			}
			else{
				isLigaDataError();
			}
		}
		else{
			//Bei vorliegenden Ligadaten 
			$scope.liga.showUpdate = true;
		}
	};
	
	
	/**
	 * Ein PopUp-Fenster wird aktiviert mit dem Hinweis zum Löschen der Liga
	 * 
	 * @params: league -> Die zu löschende Liga
	 */
	$scope.showDeleteModal = function(league){
		$scope.liga.showDelete = true;
		$scope.deleteLeague = league;
	};
	
	
	/**
	 * Bereitet die Daten der Ligawebseite auf und stellt die gefundenen Informationen in einer Liga-Liste bereit
	 * 
	 * @params: ligenplanLink -> Webseite die auf Daten überprüft werden soll
	 */
	$scope.getAllLeagues = function(ligenplanLink) {

		//Initialisieren der Variablen
		$scope.favoritLeague = null;
		$scope.quelle = false;
		$scope.leagues = null;
		$scope.jugenden = null;
		$scope.loading = true;
		
		//Hauptwebseite des Links wird herausgefiltert
		var first = ligenplanLink.indexOf("/");
		var second = ligenplanLink.indexOf("/", first + 1);
		var third = ligenplanLink.indexOf("/", second + 1);
		var hauptSeite = ligenplanLink.substring(0, third);
		
		//Link wird für die Verarbeitung aufbereitet
		ligenplanLink = ASCIIConverterService.convert(ligenplanLink);
		
		var jsonFeed = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + ligenplanLink + "%22%20and%20xpath%3D%22%2F%2Ftable%2F%2Ftr%2F%2Ftd%22&format=xml&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
		
		/**
		 * Holt sich die Daten der Webseite bei erfolgreicher Verbindung
		 */
		$http.get(jsonFeed).success(function (data) {
			
			var leagues = [];

			var gruppen = [];

			//Der String wird aufgesplittet, damit jede einzelne Zeile verarbeitet werden kann
			var lineFeed = "\u000A";
			var res = data.split(lineFeed);
			
			var jugend;
			var gender;
			for(var i=0; i < res.length; i++){
				//Suche nach Jugendgruppe
				if(res[i].indexOf("<h2>") !== -1){
					
					//JUGENDGRUPPE-FILTERN
					var help = res[i].substr(res[i].indexOf(">")+1);
					jugend = help.substr(0, help.indexOf("<"));
					
					//GENDER-SUCHEN
					if(jugend.indexOf("Männer") !== -1){
						gender = "Männlich";
					}
					else if(jugend.indexOf("männl") !== -1){
						gender = "Männlich";
					}
					else if(jugend.indexOf("Frauen") !== -1){
						gender = "Weiblich";
					}
					else if(jugend.indexOf("weib") !== -1){
						gender = "Weiblich";
					}
					else{
						gender = "Undefined";
					}
				
				}
				
				//Suche nach Liga
				else if(res[i].indexOf("<a href=") !== -1){
					//Aufbereitung des Links
					var help2 = res[i].substr(res[i].indexOf("/"));
					var link = help2.substr(0, help2.indexOf(">")-1);
					link = link.replace("amp;", "");
					
					//Aufbereitung der Benennung
					help2 = help2.substr(help2.indexOf(">")+1);
					var benennung = help2.substr(0, help2.indexOf("<"));

					var league = {};
					league.id = leagues.length+1;
					league.gender = gender;
					league.jugend = capitalizeFirstLetter(jugend);
					league.name = capitalizeFirstLetter(benennung);
					league.linkage = hauptSeite + link;
					league.specialName = "";
			        league.isActiv = false;
			        league.notePosLeft = Math.random()*40 + '%';
			        league.notePosTop = Math.random()*80 + '%';
				        			       
					leagues.push(league);
				}
			}

	    	$scope.loading = false;
	    	
	    	//LigaManager-Variablen werden aktualisiert
	    	$scope.settings.liga.leagues = leagues;
	    	
	    	$scope.updateSettings();
	    	
	    	initLigaManager();

	    	//Errorausgabe falls keine Daten gefunden worden sind
	    	if(leagues.length === 0){
	    		isLigaDataError();
	    	}
		});
	};
	
	/**
	 * Schreibt den ersten Buchstaben eines Strings groß
	 * 
	 * @params: string -> String der am Anfang groß geschrieben werden soll
	 * 
	 * @return: Aufbereiteten String
	 */
	var capitalizeFirstLetter = function (string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	};
	
	
	/**
	 * Ändert den Status der favorisierten Liga vom Benutzer
	 * 
	 * @params: league -> Liga die favorisiert wird
	 */
	$scope.changeFavorit = function(league){
		$scope.favoritLeague = league;
		$scope.updateSettings();
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
		else if($scope.liga.searchVerein  && !$scope.searchStart){
			$scope.search = false;
			$scope.searchStart = true;
			findAllLeaguesOfVerein($scope.liga.searchVerein);
			$scope.changeFavorisierterVerein($scope.liga.searchVerein);
			$scope.updateSettings();
		}
		//Deaktivierung des Suchfelds
		else{
			$scope.search = false;
		}
	};
	

	/**
	 * Überprüft sämtliche Ligen auf Vereinsstimmigkeit
	 * 
	 * @params: verein -> Verein der gesucht werden soll
	 */
	var findAllLeaguesOfVerein = function (verein){
		var leagues = $scope.leagues;
		$scope.anzahlSearch = 0;
		
		//Überprüfung jeder Liga auf Vereinsstimmigkeit 
		for(var i=0; i<leagues.length; i++){
			checkIfVereinInLeague(leagues[i], verein);
		}
	};
	
	/**
	 * Überprüft in der Liga, ob sich der Verein darin aufhält & aktiviert die Liga bei Fund
	 * 
	 * @params: league -> Liga die überprüft werden soll
	 * 			verein -> Verein der gesucht werden soll
	 */
	var checkIfVereinInLeague = function(league, verein) {
		
		var adresse = league.linkage;

	    adresse = adresse.replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');

	    var jsonFeed ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+adresse+"%22%20and%20xpath%3D%22%2F%2Ftable%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

	    /**
		 * Holt sich die Daten der Webseite bei erfolgreicher Verbindung
		 */
	    $http.get(jsonFeed).success(function (data) {
	      
	      var mannschaften = [];

	      // Bei Fehlern innerhalb Liga wird diese einfach ignoriert
	      // Grund: Einige Ligen enthalten keine Tabellen
	      try{
		      var daten = data.query.results.table[0].tbody.tr;
	
		      for(var i = 1; i < daten.length; i++){
		        var mannschaftsdaten = daten[i].td;
		        var mannschaft = {};
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
	      
	      //Aktueller Stand der Suche aktualisieren
	      $scope.progressbaraktuell = $scope.progressbaraktuell + 1;
	      $scope.progressbaraktuellprozent = (($scope.progressbaraktuell / $scope.leagues.length) * 100);
	      
	      //Bei vollständiger Suche wird die Suche deaktiviert
	      if( $scope.progressbaraktuellprozent === 100){
	    	  $scope.searchStart = false;
	    	  $scope.progressbaraktuell = 0;
	    	  $scope.progressbaraktuellprozent = 0;
	      }
	    });
	  };
	
	  
	  /**
	   * Ändert den Status der Liga ins Gegenteil von dem was ist vorher gewesen ist
	   * 
	   * @params: league -> Liga von der der Status geändert werden soll
	   */
	  $scope.changeActiv = function(league) {
		  //Wenn Liga aktiv, dann inaktiv setzen
		  if(league.isActiv){
			  deleteActivLeague(league);
		  }
		  //Wenn Liga inaktiv, dann aktiv setzen
		  else{
			  addActivLeague(league);
		  }
		  $scope.updateSettings();
	  };
	  
	  /**
	   * Ändert den Status der Liga in Aktiv um
	   * 
	   * @params: league ->  Liga von der der Status auf Aktiv gesetzt werden soll
	   */
	  var addActivLeague = function(league) {
		  league.isActiv = true;
		  
		  //Daten aktualisieren
		  $scope.activeLeagues = $filter('filter')($scope.leagues, {isActiv: 'true'});
		  $scope.activJugenden =  $filter('listGroupBy')( $scope.activeLeagues, 'jugend');
		  
		  //Wenn noch kein favorisierte Liga da ist, wird diese Liga favorisiert
		  if(isEmpty($scope.favoritLeague)){
			  $scope.changeFavorit($scope.activeLeagues[0]);
		  }
		  
		  activUser.user.settings.liga.leagues = $scope.leagues;
	  };
	  
	  /**
	   * Ändert den Status der Liga in Inaktiv um
	   * 
	   * @params: league ->  Liga von der der Status auf Inaktiv gesetzt werden soll
	   */
	  var deleteActivLeague = function(league) {
		  league.isActiv = false;
		  
		  //Daten aktualisieren
		  $scope.activeLeagues = $filter('filter')($scope.leagues, {isActiv: 'true'});
		  $scope.activJugenden =  $filter('listGroupBy')( $scope.activeLeagues, 'jugend');
		  
		  //Falls diese Liga die favorisierte Liga war, wird die allererste aktive Liga als favorisiert eingestellt
		  if($scope.favoritLeague === league){
			  $scope.changeFavorit($scope.activeLeagues[0]);
		  }
		  
		  activUser.user.settings.liga.leagues = $scope.leagues;
	  };
	  
	  /**
	   * Der benutzerdefinierte Name einer Liga wird gesetzt
	   * 
	   * @params: 	league 		-> Liga die umbenannt werden soll
	   * 			specialName -> Benutzerdefinierter Name
	   */
	  $scope.changeSpecialName = function(league, specialName) {
		  league.specialName = specialName;
		  $scope.updateSettings();
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
    	text = text.replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');
    	return text; 
    };

});