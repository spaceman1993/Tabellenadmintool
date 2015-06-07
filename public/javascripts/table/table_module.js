/**
 * Enthält Controller, Services, Direktiven etc. für die Tabellen des Tabellenadministrationstools
 */

var zIndexCount = 0; // Für Notizzettel auf Pinnwand
angular.module('tableModule', [])



/**
 * Direktive für Notiztelle des zweiten Designs
 */
.directive('stickyNote', function() {
	var linker = function(scope, element, attrs) {
		element.draggable({
			start: function(even, ui) {
				//Notiz wird an vorderste Stelle geholt
				element.css("z-index", ++zIndexCount);
			},
			stop: function(event, ui) {
				$(event.toElement).one('click', function(e){
					//Click bei Drop wird abgefangen
					e.stopImmediatePropagation();
				});
				//neue Position wird gespeichert
				scope.league.notePosLeft = ui.position.left / element.parent().width() * 100 + '%';
				scope.league.notePosTop = ui.position.top / element.parent().height() * 100 + '%';
				element.css('left', scope.league.notePosLeft);
				element.css('top', scope.league.notePosTop);
			},
			containment: 'parent'
		});
		element.css('left', scope.league.notePosLeft); //Initialwert
		element.css('top', scope.league.notePosTop); //Initialwert
	};

	return {
		restrict: 'A',
		link: linker,
		scope: {
			league: '='
		}
	};
})


/**
 * Controller für Tabellen (beide Designs)
 */
.controller("TableCtrl", ['$scope', '$http', '$filter', 'benutzerFactory', 'userFactory', 'activUser', function($scope, $http, $filter, benutzerFactory, userFactory, activUser) {
	
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
	
	/**
	 * Initialisiert die Variablen des Controllers
	 */
	$scope.initTableControllerVars = function() {
		
		$scope.mannschaften = "";
		
	    benutzerFactory.getUserByName({"name":"admin"}, function(admin){
	    	
	    	//Falls noch kein Admin eingerichtet worden ist wird der FirstStart-Willkommens-Screen aktiviert
			if(admin === null){
				$scope.firstStart = true;
				$scope.willkommen = true;
			}
			else{
				//Wenn ein aktiver Benutzer vorhanden ist wird dieser als Benutzer eingerichtet
				if(!isEmpty(activUser.user.name)){
					$scope.isLogin = activUser.isLogin;
					$scope.benutzer = activUser.user;
				}
				//Wenn kein aktiver Benutzer angemeldet ist werden die Daten des Admin für die Standardanzeige bereitgestellt
				else{
					activUser.user = admin;
					$scope.benutzer = activUser.user;
				}
				
				//Wenn ein Benutzer vorliegt, werden dessen Daten übernommen
				if(!isEmpty($scope.benutzer)){
					$scope.nickname = $scope.benutzer.name;
					
					$scope.firstDesign = $scope.benutzer.settings.anzeige.designauswahl.firstdesign;
					$scope.secondDesign = $scope.benutzer.settings.anzeige.designauswahl.seconddesign;
					$scope.favoritVerein = $scope.benutzer.settings.anzeige.favoritVerein;
					$scope.spielplan = $scope.benutzer.settings.anzeige.spielplan;
					$scope.verwaltung = $scope.benutzer.settings.anzeige.verwaltung;
					
					$scope.design = $scope.benutzer.settings.anzeige.standardDesign;
					$scope.applicationDesign = $scope.benutzer.settings.design.applicationDesign;
					$scope.tableDesign = $scope.benutzer.settings.design.tableDesign;
					$scope.activeLeagues = $filter('filter')($scope.benutzer.settings.liga.leagues, {isActiv: 'true'});
					$scope.favoritLeague = $scope.benutzer.settings.liga.favoritLeague;
				}
				
				//Wenn eine favorisierte Liga vorliegt wird diese Liga geladen
				if(!isEmpty($scope.favoritLeague)){
					$scope.getTableForLeague($scope.favoritLeague);
				}
			}
	    });
		
		
		
		
	};
	
	/**
	 * Überprüft die Verhaltensregeln für die Loginmöglichkeit
	 */
	$scope.checkLogin = function() {
		
		var errorHeader = '';
		//Falls der Willkommens-Screen noch aktiv ist, wird dieser wieder gestartet
		if($scope.willkommen){
			$scope.firstStart = true;
		}
		//Standardgemäß wird die Möglichkeit für den Login gegeben
		else{
			$scope.showLogin = !$scope.showLogin; 
		}
		
	};
	
	/**
	 * Login-Funktion
	 * 
	 * @params: name	 -> Name des Benutzers
	 * 			passwort -> Passwort des Benutzers
	 */
	$scope.loginBenutzer = function(name, passwort) {
		  
		$scope.showLogin = false; 
		
		$scope.errorHeader = "";
		  
		//Daten werden aus der Datenbank für den Benutzer ausgelesen und überprüfung, ob Passwort übereinstimmt
		benutzerFactory.login({"name" : name, "passwort" : passwort }, function(benutzer){
		//Passwort übereinstimmt oder...
		if(benutzer !== null && benutzer.name !== "code404" && benutzer.name !== "code403"){
		//Benutzer nicht gefunden
		
		activUser.user = benutzer;
		activUser.isLogin = true;
		$scope.benutzer = activUser.user;
		$scope.isLogin = activUser.isLogin;
		
		//Daten für den Controller werden aktualisiert
		$scope.initTableControllerVars();
		}
		//Bei Falscheingabe wird ein Error ausgegeben
		else if(benutzer.name !== "code403"){
		 $scope.errorHeader = "Kennwort falsch";
		}
		//Bei nicht vorliegen des Benutzers wird ein Error ausgegeben
		else{
		$scope.errorHeader = "Keinen Benutzer unter diesen Namen vorhanden";
		}

  });
	};
	
	/**
	 * Logout-Funktion
	 */
	$scope.logoutBenutzer = function() {
		//Aktiver Benutzer wird deaktiviert und der Controller wird aktualisiert
		activUser.user = {};
		activUser.user.name = {};
		activUser.isLogin = false;
		$scope.isLogin = activUser.isLogin;
		$scope.initTableControllerVars();
	};
	
	/**
	 * Registieren-Funktion
	 * 
	 * @params: benutzer -> Benutzer-Objekt mit sämtlichen Informationen
	 */
	$scope.registiereBenutzer = function(benutzer) {
		//Überprüfung, ob Registierungsvorgang genehmigt werden kann
		if(!$scope.inVerwendung && $scope.registration.benutzername && !$scope.isIncorrect && $scope.isGleich){	
			$scope.registieren = false;
			
			//Übernahme der aktuell eingestellten Admin-Settings
			benutzerFactory.getUserByName({"name":"admin"}, function(admin){
			
				var settings = angular.copy(admin.settings);
				
				benutzerFactory.create({"name":benutzer.benutzername, "passwort":benutzer.passwort, "settings": settings}, function(newBenutzer){
					
						$scope.loginBenutzer(newBenutzer.name, benutzer.passwort);

				});
			
			});
		}
	};
	
	/**
	 * Registiere-Admin-Account
	 * 
	 * @params: passwort -> Passwort, das der Admin vergibt
	 */
	$scope.registiereAdminAccount = function(passwort) {
		//Überprüfung, ob Registierungsvorgang genehmigt werden kann
		if(!$scope.isIncorrect && $scope.isGleich){	
		
			$scope.willkommen = false;
			
			//Standard-Settings werden aufbereitet
			var settings = {};
			
			settings.anzeige = {};
			settings.anzeige.designauswahl = {};
			settings.anzeige.designauswahl.firstdesign = true;
			settings.anzeige.designauswahl.seconddesign = true;
			settings.anzeige.standardDesign = "1";
			settings.anzeige.favoritVerein = "";
			settings.anzeige.spielplan = "ja";
			settings.anzeige.verwaltung = "ja";
			
			settings.design = {};
			settings.design.tableDesign = {};
			settings.design.tableDesign.backgroundColorHeader = "#030094";
			settings.design.tableDesign.textColorHeader = "#ffffff";
			settings.design.tableDesign.backgroundColor = "#ffffff";
			settings.design.tableDesign.textColor = "#000000";
			settings.design.tableDesign.tableStriped = true;
			settings.design.tableDesign.stripedColor = "#cccccc";
			settings.design.tableDesign.captionColor = "#000000";
			settings.design.tableDesign.highlightColor = "#9ca0ff";
			settings.design.tableDesign.tableBordered = false;
			
			settings.design.applicationDesign = {};
			
			settings.design.applicationDesign.backgroundColor = "black";
			settings.design.applicationDesign.abstandRand = "10px";
			
			settings.design.applicationDesign.backgroundColorHeaderFooter = "blue";
			settings.design.applicationDesign.textColorHeaderFooter = "yellow";
			
			settings.design.applicationDesign.backgroundColorBody = "green";
			settings.design.applicationDesign.textColorBody = "orange";
			settings.design.applicationDesign.actionColor = "red";
			
			settings.liga = {};
			settings.liga.leagues = [];
			settings.liga.favoritLeague = {};
			
			//Admin wird in der Datenbank übernommen
			benutzerFactory.create({"name":"admin", "passwort": passwort, "settings": settings}, function(admin){
				//Admin wird direkt angemeldet
				$scope.loginBenutzer(admin.name, passwort);
				
				$scope.registration = {};
			});

		}
	};
	
	/**
	 * Erzeugt ein PopUp mit dem Registrierungsformular
	 */
	$scope.showRegistration = function() {
		//Variablen initialisieren
		$scope.registieren = true;
		$scope.inVerwendung = false;
		$scope.isIncorrect = true;
		$scope.isGleich = false;
		$scope.registration = {};
		benutzerFactory.getAllUser(function(allUser){
			$scope.allBenutzer = allUser;
			
			//Wenn das PopUp noch nicht aktiviert ist wird dieses aktiviert
			if(isEmpty($scope.registrationShown) || $scope.registrationShown === false){
				$scope.registrationShown = true;
				
			}
			else{
				$scope.registrationShown = false;
			}
		});
		
	};
	
	/**
	 * Überprüfung, ob Benutzername schon vergeben ist
	 * 
	 * @params: benutzer -> Benutzername der überprüft werden soll
	 */
	$scope.checkBenutzer = function(benutzer) {
		$scope.inVerwendung = false;
		var i=0;
		//Überprüfung aller Benutzernamen bis angegebener Benutzername gefunden worden ist
		//oder alle Benutzer durchsucht worden sind
		while(i<$scope.allBenutzer.length && !$scope.inVerwendung){
			//Bei Fund wird dies gemeldet und die Suche wird beendet
			if(benutzer.toLowerCase() === $scope.allBenutzer[i].name.toLowerCase()){
				$scope.inVerwendung = true;
			}
			i++;
		}
	};
	
	/**
	 * Überprüfung, ob Passwort den Sicherheitsstandards entspricht
	 * 
	 * @params: passwort -> Passwort das überprüft werden soll
	 */
	$scope.checkPasswort = function(passwort) {
		$scope.isIncorrect = false;
		
		//Überprüfung, ob Passwort mindestens 6-stellig ist
		if(passwort.length < 6){
			$scope.isIncorrect = true;
			$scope.fehlerText = "Passwort muss min. 6-stellig sein";
		}
		//Überprüfung, ob Passwort mindestens eine Zahl enthält
		else if(!(/\d/.test(passwort))){
			$scope.isIncorrect = true;
			$scope.fehlerText = "Passwort muss min. eine Zahl enthalten";
		}
	};
	
	/**
	 * Überprüfung, ob Passwortwiederholung gleich dem Passwort ist
	 * 
	 * @params: passwort 	-> 1.Passwort 
	 * 			passwortbst -> 2.Passwort
	 */
	$scope.checkPasswortBst = function(passwort, passwortbst) {
		//Überprüft, ob Passwörter gleich sind
		if(passwort === passwortbst){
			$scope.isGleich = true;
		}
		else{
			$scope.isGleich = false;
		}
	};
	
	/**
     * Überprüft, ob der übergebende Parameter eine Zahl ist und liefert die passende Antwort zurück
     * 
     * @params: value	-> Der String der überprüft werden soll
     * 
     * @return: true	-> Wenn Parameter eine Zahl ist
     * 			false	-> Wenn keine Zahl ist
     */
    $scope.isNumber = function (value) {
        return !isNaN(value);
    };
    
    /**
     * Überprüft, ob mein benutzerdefininierter Name für eine Liga vergeben worden ist und gibt die ggf. zurück
     * 
     * @params: league -> Liga die überprüft werden soll
     * 
     * @return: Liefert den Namen der Liga zurück, ggf. den benutzerdefinierten Name wenn er vorhanden ist
     */
    $scope.getNameForLeague = function(league){
    	if(isEmpty(league.specialName)){
    		return league.jugend;
    	}else{
    		return league.specialName;
    	}
    };
    
    /**
     * Wählt eine entsprechende Farbe für den Input
     * 
     * @params: input -> Parameter der bestimmt welche Farbe zurückgegeben werden soll
     * 
     * @return: Eine bestimmte gewählte Farbe
     */
    $scope.chooseColor = function (input) {
    	
    	if(input === 'Herren' || input === 'Männlich'){
    		return 'btn-primary';
    	}
    	else if(input === 'Damen' || input === 'Weiblich'){
    		return 'btn-danger';
    	}
    	
    };
  
    /**
     * Überprüft, ob der Aufruf eines Objekts funktioniert und gibt dieses Objekt zurück
     * Bei nicht funktionieren wird die nächst untere Ebene des Objekts auf Daten überprüft
     * und diese werden dann zurückgegeben
     * 
     * @params: obj 			->	Objekt das überprüft wird
     * 			returnObject 	->	true:  Objekt wird bei nicht finden der obersten Ebene zurückgegeben
     * 								false: Objekt wird nicht zurückgegeben, sondern ein *blank
     * 			arguments		->	Objekt-Aufrufs-Reihenfolge
     * 
     * @return: Gefundenen Objekt der zuletzt erreichten Ebene
     */
    var checkAndGetData =  function (obj, returnObject /*, level1, level2, ... levelN*/) {
    	//Übernahme aller restlichen Argumente des Funktionsaufrufs
    	var args = Array.prototype.slice.call(arguments, 1);

    	//Überprüfung der Objektebenen
    	for (var i = 1; i < args.length; i++) {
    		//Überprüft, ob Objekt nicht exisiert
    		if (!obj || !obj.hasOwnProperty(args[i])) {
    			//Überprüft, ob das vorherige Objekt Daten enthält und ob das Objekt zurück gegeben werden soll
    			if(!isEmpty(obj) && returnObject){
    				//Wenn Content-Ebene vorhanden, werden diese Daten zurückgegeben
    				if(typeof obj.content !== "undefined"){
    					return obj.content;
    				}
    				//Anderenfalls wird das Objekt zurückgegeben
    				else{
    					return obj;
    				}
    			}
    			//Anderenfalls wird ein *blank zurückgeliefert
    			else{
    				return '';
    			}
    		}
    		//Neues Objekt ist das aktuell überprüfte Objekt
    		obj = obj[args[i]];
    	}
    	return obj;
    };
    
    /**
     * Erzeugt die Daten für die Tabellen der Liga
     * 
     * @params: league -> Liga von der die Daten gezogen werden sollen
     */
	$scope.getTableForLeague = function(league) {
		
		//Variablen initialisieren
		$scope.mannschaften = null;
		$scope.nextGames = null;
		$scope.loading = true;
		$scope.error = null;
		
		//Ligabezeichnung wird erzeugt
		$scope.leagueName = $scope.getNameForLeague(league) + ' (' + league.name + ')';
		
		//Link wird aufbereitet für die Abholung der Daten
		var adresse = league.linkage;	
	    adresse = adresse.replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');
	    var jsonFeed ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+adresse+"%22%20and%20xpath%3D%22%2F%2Ftable%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

	    /**
		 * Holt sich die Daten der Webseite bei erfolgreicher Verbindung
		 */
	    $http.get(jsonFeed).success(function (data) {
	      
	    	var mannschaften = [];
	
			//Überprüft, ob die Daten den Daten entsprechen, die verarbeitet werden können
			var daten = checkAndGetData(data, false, 'query', 'results', 'table', '0', 'tbody', 'tr');
			
			//Überprüfung, ob Daten vorliegen
			if(daten !== ""){
				
				//Daten für die Ligatabelle werden aufbereitet und in einem Array gespeichert
				for(var i = 1; i < daten.length; i++){
					var mannschaftsdaten = daten[i].td;
					
					var mannschaft = {};
					mannschaft.rang = parseInt(checkAndGetData(mannschaftsdaten[1], true, 'content'));
					mannschaft.mannschaft = checkAndGetData(mannschaftsdaten[2], true, 'a', 'content');
					mannschaft.begegnungen = checkAndGetData(mannschaftsdaten[3], true, 'content');
					mannschaft.siege = checkAndGetData(mannschaftsdaten[4], true, 'content');
					mannschaft.unentschieden = checkAndGetData(mannschaftsdaten[5], true, 'content');
					mannschaft.niederlagen = checkAndGetData(mannschaftsdaten[6], true, 'content');
					mannschaft.tore = checkAndGetData(mannschaftsdaten[7], true, 'content');
					mannschaft.verhaeltnis = checkAndGetData(mannschaftsdaten[8], true, 'content');
					mannschaft.punkte = checkAndGetData(mannschaftsdaten[9], true, 'content');
					
					mannschaften.push(mannschaft);
				}
		
				//Falls ein Spielplan gewünscht ist werden diese Daten auch geladen
				if($scope.spielplan === 'ja'){
					
					var nextGames = [];
					//Überprüft, ob die Daten den Daten entsprechen, die verarbeitet werden können
					daten = checkAndGetData(data, false, 'query', 'results', 'table', '1', 'tbody', 'tr');
					if(daten !== ""){
						//Daten für die Spieplantabelle werden aufbereitet und in einem Array gespeichert
						for(i = 1; i< daten.length; i++){
							var spieldaten = daten[i].td;
					    
							var nextGame = {};
							nextGame.tag = checkAndGetData(spieldaten[0], true, 'content');
							nextGame.datum = checkAndGetData(spieldaten[1], true, 'content');
							nextGame.zeit = checkAndGetData(spieldaten[2], true, 'content').substr(35, 5);
							nextGame.halle = checkAndGetData(spieldaten[3], true, 'span', 'a', 'content');
							nextGame.hallenname = checkAndGetData(spieldaten[3], true, 'span', 'title');
							nextGame.hallenlink = checkAndGetData(spieldaten[3], true, 'span', 'a', 'href');
							nextGame.nr = checkAndGetData(spieldaten[4], true);
							nextGame.heimmannschaft = checkAndGetData(spieldaten[5], true, 'content'); 
							nextGame.gastmannschaft = checkAndGetData(spieldaten[6], true, 'content');
							nextGame.tore = checkAndGetData(spieldaten[7], true, 'span', 'content');
					
						    nextGames.push(nextGame);
						}
					}
				}
				      
				$scope.loading = false;
				
				$scope.mannschaften = mannschaften;
				$scope.nextGames = nextGames;
			}
			//Wenn keine Daten vorliegen lag ein Fehler vor. Dieser wird auch ausgegeben
			else{
				$scope.loading = false;
				$scope.error = true;
			}   
		});
	    
	};
	
}])



/**
 * Pseudo-Datenbank
 */
.factory("userFactory", function () {
    var benutzerListe = [];
    
    var findByName = function (name) {
  	  for (var i = 0; i < benutzerListe.length; i++) {
  	    if (benutzerListe[i].name === name) {
  	      return benutzerListe[i];
  	    }
  	  }
  	  	return null;
    };
    
    var findAllBenutzer = function () {
    	return benutzerListe;
    };
    
    return {
      getAllBenutzer: function () {
    	return findAllBenutzer();  
      },
      getBenutzer: function (name) {
        return findByName(name);
      },
      addBenutzer: function (name, passwort, settings) {
        benutzerListe.push({name:name, passwort:passwort, settings:settings});
      }
    };
    
});