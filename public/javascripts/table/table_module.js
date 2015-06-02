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
.controller("TableCtrl", ['$scope', '$http', '$filter', 'dataService', 'userFactory', 'activUser', 'benutzerFactory', function($scope, $http, $filter, dataService, userFactory, activUser, benutzerFactory) {
   
	$scope.tableDesign = dataService.tableDesign;
	
	var isEmpty = function (obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	};
	
	
	/**
	 * Initialisierung eines eingeloggten Admins und Standardwerte für die Anzeige
	 */
	$scope.initTableControllerVars = function() {
		
		if(userFactory.getBenutzer("admin") === null){
			userFactory.addBenutzer("admin", "passwort", true, true, '1', '', 'ja', 'ja', '');
		}
		
		if(!isEmpty(activUser.user)){
			$scope.benutzer = activUser.user;
			$scope.isLogin = true;
		}
		else{
			$scope.benutzer = userFactory.getBenutzer("admin");
			activUser.user = $scope.benutzer;
		}
		
		
		$scope.design = $scope.benutzer.standardDesign;
		$scope.activeLeagues = $filter('filter')(dataService.leagues, {isActiv: 'true'});
		
		if(!isEmpty($scope.benutzer.favoritLeague)){
			$scope.getTableForLeague($scope.benutzer.favoritLeague);
		}
	};
	
	
	/**
	 * Login eines Benutzers
	 */
	$scope.loginBenutzer = function(name, passwort) {
		
		if(userFactory.getBenutzer(name) === null){
			$scope.addBenutzer(name, passwort);
			$scope.loginBenutzer(name, passwort);
			//$scope.error = "Benutzer mit angegebenem Kennwort unbekannt ";
		}
		else{
			$scope.benutzer = userFactory.getBenutzer(name);
			activUser.user = $scope.benutzer;
			$scope.isLogin = true;
			$scope.initTableControllerVars();
		}
	};
	
	
	/**
	 * Logout eines Benutzers
	 */
	$scope.logoutBenutzer = function() {
		$scope.benutzer = null;
		activUser.user = null;
		$scope.isLogin = false;
		$scope.initTableControllerVars();
	};
	
	
	/**
	 * Benutzer wird mit Standard-Designs des Admins erstellt
	 */
	$scope.addBenutzer = function(name, passwort) {
		
		var admin = userFactory.getBenutzer('admin');
		
		userFactory.addBenutzer(name, passwort, admin.first, admin.second, admin.standardDesign, admin.favoritVerein, admin.spielplan, admin.verwaltung, admin.favoritLeague);
	};
	
	
	/**
	 * Prüft, ob ein Wert eine Zahl ist
	 */
    $scope.isNumber = function (value) {
        return !isNaN(value);
    };
    
    
    /**
     * Prüft, ob eine Mannschaft der Favorit ist
     */
    $scope.isHighlight = function (mannschaft) {
    	
    	if(String($scope.benutzer.favoritVerein).length > 3 && String(mannschaft.mannschaft).match($scope.benutzer.favoritVerein)){
    		return 'success';
    	}
    	
    };
    
    
    
   /**
    * Gibt den Namen einer Liga zurück
    */
    $scope.getNameForLeague = function(league){
    	if(isEmpty(league.specialName)){
    		return league.jugend;
    	}else{
    		return league.specialName;
    	}
    };
    
    
    /**
     * Wählt nach Geschlecht eine Button-Farbe
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
     * Holt externe Daten für eine Liga
     */
	$scope.getTableForLeague = function(league) {

		$scope.mannschaften = null;
		$scope.nextGames = null;
		$scope.loading = true;
		
		$scope.leagueName = league.jugend + ' (' + league.name + ')';
		var adresse = league.linkage;
		
	    console.log(adresse);
	    adresse = adresse.replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('+','%2B').replace('&','%26').replace('+','%2B');
	
	    var jsonFeed ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+adresse+"%22%20and%20xpath%3D%22%2F%2Ftable%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	
	
	    // Actually fetch the data
	    $http.get(jsonFeed).success(function (data) {
	      // Define the unique market cities
	      
	      var mannschaften = new Array();
	
	      var daten = data.query.results.table[0].tbody.tr;
	      for(var i = 1; i < daten.length; i++){
	        var mannschaftsdaten = daten[i].td;
	        
	        var mannschaft = new Object();
	        mannschaft.rang = parseInt(mannschaftsdaten[1].content);
	        if (typeof mannschaftsdaten[2].a !== "undefined"){
	        	mannschaft.mannschaft = mannschaftsdaten[2].a.content;
	        }else{
	        	mannschaft.mannschaft = mannschaftsdaten[2].content;
	        }
	        
	        mannschaft.begegnungen = mannschaftsdaten[3].content;
	        mannschaft.siege = mannschaftsdaten[4].content;
	        if (typeof mannschaftsdaten[5] !== "undefined"){
	          mannschaft.unentschieden = mannschaftsdaten[5].content;
	        }
	        if (typeof mannschaftsdaten[6] !== "undefined"){
	        mannschaft.niederlagen = mannschaftsdaten[6].content;
	        }
	        if (typeof mannschaftsdaten[7] !== "undefined"){
	        mannschaft.tore = mannschaftsdaten[7].content;
	        }
	        if (typeof mannschaftsdaten[8] !== "undefined"){
	        mannschaft.verhaeltnis = mannschaftsdaten[8].content;
	        }
	        if (typeof mannschaftsdaten[9] !== "undefined"){
	        mannschaft.punkte = mannschaftsdaten[9].content;
	        }
	        
	        mannschaften.push(mannschaft);
	      }
	
	      if($scope.benutzer.spielplan === 'ja'){
		      var nextGames = new Array();
		      
		      daten = data.query.results.table[1].tbody.tr;
		      for(i = 1; i< daten.length; i++){
		        var spieldaten = daten[i].td;
		        
		        var nextGame = new Object();
		        nextGame.tag = spieldaten[0].content;
		        nextGame.datum = spieldaten[1].content;
		        nextGame.zeit = spieldaten[2].content.substr(35, 5);
		        nextGame.halle = spieldaten[3].span.a.content;
		        nextGame.hallenname = spieldaten[3].span.title;
		        nextGame.hallenlink = spieldaten[3].span.a.href;
		        nextGame.nr = spieldaten[4];
		        nextGame.heimmannschaft = spieldaten[5].content;
		        nextGame.gastmannschaft = spieldaten[6].content;
		        if (typeof spieldaten[7].span.content !== "undefined"){
		          nextGame.tore = spieldaten[7].span.content;
		        }
		        else if (typeof spieldaten[7].span !== "undefined"){
		          nextGame.tore = spieldaten[7].span;
		        }
		        
		        nextGames.push(nextGame);
		      }
	      }
	      
	      $scope.loading = false;
	      
	      $scope.mannschaften = mannschaften;
	      $scope.nextGames = nextGames;
	    });
	};
	
	
	/**
	 * Holt externe Daten der favorisierten Liga als Standard
	 */
	if(!isEmpty($scope.favoritLeague)){
		$scope.getTableForLeague($scope.favoritLeague);
	}	
}])



/**
 * Pseudo-Datenbank
 */
.factory("userFactory", function () {
    var benutzerListe = [];
    
    
    /**
     * Gibt den ersten Benutzer aus der Liste zurück, der den gesuchten Namen trägt
     */
    var findByName = function (name) {
  	  for (var i = 0; i < benutzerListe.length; i++) {
  	    if (benutzerListe[i].name === name) {
  	      return benutzerListe[i];
  	    }
  	  }
  	  return null;
    };
    
    return {
      getBenutzer: function (name) {
        return findByName(name);
      },
      addBenutzer: function (name, passwort, first, second, standardDesign, favoritVerein, spielplan, verwaltung, favoritLeague) {
        benutzerListe.push({name:name, passwort:passwort, first:first, second:second, standardDesign:standardDesign, favoritVerein:favoritVerein, spielplan:spielplan, verwaltung:verwaltung, favoritLeague:favoritLeague});
      }
    };
    
});